import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            trim: true,
            // Data Validation
            required: [true, 'A tour must have a name'],
            maxlength: [
                40,
                'tour must have less than or equal 40 characters',
            ],
            minlength: [
                10,
                'tour must have more than or equal 10 characters',
            ],
        },

        slug: {
            type: String,
        },

        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },

        maxGroupSize: {
            type: Number,
            required: [
                true,
                'A tour must have a group size',
            ],
        },

        difficulty: {
            type: String,
            required: [
                true,
                'A tour must have a difficulty',
            ],
            // Data Validation
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message:
                    'Difficulty can be either easy, medium or difficult',
            },
        },

        ratingsAverage: {
            type: Number,
            default: 4.5,
            // Data Validation
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
        },

        ratingsQuantity: {
            type: Number,
            default: 0,
        },

        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },

        priceDiscount: {
            type: Number,
            // Custom Data Validation
            validate: {
                validator: function (val) {
                    // 'this' keyword only point to the current doc on NEW DOCUMENT creation (NOT EDITING OR UPDATING)
                    return val < this.price;
                },
                message:
                    'Discount price ({VALUE}) should be below the regular price',
            },
        },

        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary'],
        },

        description: {
            type: String,
            trim: true,
            required: [
                true,
                'A tour must have a description',
            ],
        },

        imageCover: {
            type: String,
            required: [
                true,
                'A tour must have a cover image',
            ],
        },

        images: [String],

        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },

        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// adding virtual property which is not saved in database but we can use its value for our tasks:
// for example: the duration of a tour based on week

tourSchema.virtual('weekDuration').get(function () {
    return this.duration / 7;
});

// mongoose like express has the concept of middleware
// it is written using .pre() and .post() methods and then the event defines as the first argument ('save', 'find', ...)

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true }); // adding slug after the document saves
    next();
});

// QUERY MIDDLEWARE: runs before .find()
tourSchema.pre(/^find/, function (next) {
    // find() , findById(), findByIdAndUpdate() , findByIdAndDelete(),
    this.find({ secretTour: { $ne: true } }); // $ne = 'not equal to'
    this.start = Date.now(); // it will be used in the post middleware (next middleware) to see the time takes to execute
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(
        `query took ${Date.now() - this.start} milliseconds`,
    );
    next();
});

// AGGREGATION MIDDLEWARE:
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { secretTour: { $ne: true } },
    });
    next();
});

const Tour = new mongoose.model('Tour', tourSchema);

export default Tour;

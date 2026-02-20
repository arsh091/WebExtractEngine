import mongoose from 'mongoose';

const extractionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['single', 'bulk'],
        default: 'single'
    },
    data: {
        phones: [String],
        emails: [String],
        addresses: [String],
        companyInfo: {
            name: String,
            title: String,
            description: String,
            logo: String,
            favicon: String
        },
        socialMedia: {
            facebook: String,
            instagram: String,
            twitter: String,
            linkedin: String,
            youtube: String,
            telegram: String,
            whatsapp: mongoose.Schema.Types.Mixed
        }
    },
    count: {
        phones: Number,
        emails: Number,
        addresses: Number,
        total: Number
    },
    processingTime: String,
    isFavorite: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Extraction', extractionSchema);

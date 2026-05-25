import mongoose from "mongoose";

const visualElementSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true,
        enum: ['svg', 'div', 'motion.svg', 'motion.div', 'img']
    },
    className: String,
    style: mongoose.Schema.Types.Mixed,
    animate: mongoose.Schema.Types.Mixed,
    transition: mongoose.Schema.Types.Mixed,
    viewBox: String,
    paths: [String], // For SVG paths
    props: mongoose.Schema.Types.Mixed, // For any other props
    children: [mongoose.Schema.Types.Mixed], // For nested elements
});

const moodSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    }, // e.g. 'coastal-relax'
    label: { 
        type: String, 
        required: true 
    }, // e.g. 'Coastal Relax'
    bgColor: { 
        type: String, 
        required: true 
    }, // e.g. '#ecf9f8'
    fgColor: { 
        type: String, 
        default: '#1e293b' 
    }, // e.g. '#1e293b'
    visualElements: [visualElementSchema],
});

const themeMetaDataSchema = new mongoose.Schema({
    moods: [moodSchema],
    travelStyle: {
        type: [String],
        default: []
    },
    theme: {
        type: [String],
        default: []
    },
}, { timestamps: true });

export const ThemeMetaData = mongoose.model("ThemeMetaData", themeMetaDataSchema);

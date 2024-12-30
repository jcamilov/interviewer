/**
 * Adds a timestamp to a file name while preserving its extension
 * @param file - The File object to process
 * @returns string - The original filename with a timestamp added before the extension
 */
export const addTimestampToFileName = (file: File): string => {
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf('.');
    
    // Get the current timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (lastDotIndex === -1) {
        // No extension
        return `${fileName}_${timestamp}`;
    }
    
    // Split the name and extension
    const nameWithoutExtension = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex);
    
    return `${nameWithoutExtension}_${timestamp}${extension}`;
};

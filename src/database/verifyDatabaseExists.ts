import * as FileSystem from 'expo-file-system';

const dbPath = `${FileSystem.documentDirectory}SQLite/skiltSHK.db`;

export async function verifyDatabaseExists(): Promise<void> {
    try {
        const fileInfo = await FileSystem.getInfoAsync(dbPath);

        if (fileInfo.exists) {
        console.log('Database file exists:', dbPath, 'Size:', fileInfo.size);
        } else {
        console.warn('Database file does NOT exist:', dbPath);
        }
    } catch (error) {
    }
}
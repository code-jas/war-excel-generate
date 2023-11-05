import { promises as fs } from 'fs';
import path from 'path'
import XlsxTemplate from 'xlsx-template'

export default class XLSPrinter {

    static async print(template, values, sheet) {
        try {
            const filename = path.join(path.resolve('./'), 'templates', template);
            const file = await fs.readFile(filename);

            var template = new XlsxTemplate(file);

            await template.substitute(sheet || 1, values);
            return template.generate('base64');
        } catch (error) {
            console.error('Error occurred while generating Excel:', error);
            throw error; // re-throw the error to handle it in the calling function
        }
    }

    static async printMultipleSheet(template, values) {
        const filename = path.join(path.resolve('./'), 'templates', template)

        const file = await fs.readFile(filename);

        var template = new XlsxTemplate(file);

        Object.keys(values).forEach(async (key, index) => {
            await template.substitute(index + 1, values[key]);
        });
        return template.generate('base64');
    }

}

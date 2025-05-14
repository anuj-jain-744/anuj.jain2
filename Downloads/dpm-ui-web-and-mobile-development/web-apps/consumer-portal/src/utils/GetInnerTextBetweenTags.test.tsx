import { getInnerTextBetweenTags } from '../utils/GetInnerTextBetweenTags';

describe('getInnerTextBetweenTags', () => {
    it('should return the inner text between start and end tags', () => {
        const text = '<div>This is some text</div>';
        const startTag = '<div>';
        const endTag = '</div>';
        const result = getInnerTextBetweenTags(text, startTag, endTag);
        expect(result).toBe('This is some text');
    });

    it('should return null if start tag is not found', () => {
        const text = '<div>This is some text</div>';
        const startTag = '<p>';
        const endTag = '</div>';
        const result = getInnerTextBetweenTags(text, startTag, endTag);
        expect(result).toBeNull();
    });

    it('should return null if end tag is not found', () => {
        const text = '<div>This is some text</div>';
        const startTag = '<div>';
        const endTag = '</p>';
        const result = getInnerTextBetweenTags(text, startTag, endTag);
        expect(result).toBeNull();
    });

    it('should return null if start tag comes after end tag', () => {
        const text = '<div>This is some text</div>';
        const startTag = '</div>';
        const endTag = '<div>';
        const result = getInnerTextBetweenTags(text, startTag, endTag);
        expect(result).toBeNull();
    });
});
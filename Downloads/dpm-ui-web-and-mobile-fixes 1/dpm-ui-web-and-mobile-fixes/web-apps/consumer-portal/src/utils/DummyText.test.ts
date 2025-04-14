import { DummyText } from './DummyText';

describe('DummyText', () => {
  const DummyTextContent =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  it('should return the correct substring for valid startindex and endindex', () => {
    const result = DummyText(0, 11);
    expect(result).toBe('Lorem Ipsum');
  });

  it('should handle cases where startindex is out of bounds', () => {
    const result = DummyText(-5, 11);
    expect(result).toBe('Lorem Ipsum');
  });

  it('should handle cases where endindex is out of bounds', () => {
    const result = DummyText(0, DummyTextContent.length + 10);
    expect(result).toBe(DummyTextContent);
  });

  it('should handle cases where startindex is greater than endindex', () => {
    const result = DummyText(10, 5);
    expect(result).toBe(' Ipsu');
  });

  it('should return an empty string if startindex and endindex are the same', () => {
    const result = DummyText(5, 5);
    expect(result).toBe('');
  });
});
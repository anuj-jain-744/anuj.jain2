import React from 'react';
import { render } from '@testing-library/react';
import { Template } from './index';
import { ProductsTemplate } from './product';
import { NewsArticleTemplate } from './NewsArticle';

jest.mock('./product', () => ({
  ProductsTemplate: jest.fn(() => <div>ProductsTemplate</div>),
}));

jest.mock('./NewsArticle', () => ({
  NewsArticleTemplate: jest.fn(() => <div>NewsArticleTemplate</div>),
}));

describe('Template Component', () => {
  it('renders ProductsTemplate by default', () => {
    const { getByText } = render(<Template data={{}} />);
    expect(getByText('ProductsTemplate')).toBeInTheDocument();
  });

  it('renders ProductsTemplate when templateType is "product"', () => {
    const { getByText } = render(<Template templateType="product" data={{}} />);
    expect(getByText('ProductsTemplate')).toBeInTheDocument();
  });

  it('renders NewsArticleTemplate when templateType is "newsArticle"', () => {
    const { getByText } = render(<Template templateType="newsArticle" data={{}} />);
    expect(getByText('NewsArticleTemplate')).toBeInTheDocument();
  });
});
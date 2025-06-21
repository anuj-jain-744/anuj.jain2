import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PersonalAdd from './index';

const mockStore = configureStore([]);

describe('PersonalAdd Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      dashbaordLanguageData: {
        languageData: {
          sidebar_image1: 'test-image-url',
          sidebar_image1_title: 'Test Title',
          sidebar_image1_desc: 'Test Description',
          sidebar_image1_buttontext: 'Test Button Text',
        },
      },
    });
  });

  it('renders correctly with languageData', () => {
    const { getByAltText, getByText } = render(
      <Provider store={store}>
        <PersonalAdd hideBanner={false} />
      </Provider>
    );

    expect(getByAltText('sidebar image1')).toHaveAttribute('src', 'test-image-url');
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(getByText('Test Button Text')).toBeInTheDocument();
  });

  it('applies buttonWidth class when hideBanner is true', () => {
    const { container } = render(
      <Provider store={store}>
        <PersonalAdd hideBanner={true} />
      </Provider>
    );

    const buttonContainer = container.querySelector('.buttonClick1');
    expect(buttonContainer).toHaveClass('buttonWidth');
  });

  it('does not apply buttonWidth class when hideBanner is false', () => {
    const { container } = render(
      <Provider store={store}>
        <PersonalAdd hideBanner={false} />
      </Provider>
    );

    const buttonContainer = container.querySelector('.buttonClick1');
    expect(buttonContainer).not.toHaveClass('buttonWidth');
  });

  it('renders correctly when languageData is missing', () => {
    store = mockStore({
      dashbaordLanguageData: {
        languageData: null,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <PersonalAdd hideBanner={false} />
      </Provider>
    );

    expect(container.querySelector('.sidebar image1')).toBeNull();
    expect(container.querySelector('.boosty-text')).toBeEmptyDOMElement();
    expect(container.querySelector('.add-domestic')).toBeEmptyDOMElement();
    expect(container.querySelector('.buttonClick')).toBeEmptyDOMElement();
  });

  it('does not render elements when languageData properties are undefined', () => {
    store = mockStore({
      dashbaordLanguageData: {
        languageData: {
          sidebar_image1: undefined,
          sidebar_image1_title: undefined,
          sidebar_image1_desc: undefined,
          sidebar_image1_buttontext: undefined,
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <PersonalAdd hideBanner={false} />
      </Provider>
    );

    expect(container.querySelector('.sidebar image1')).toBeNull();
    expect(container.querySelector('.boosty-text')).toBeEmptyDOMElement();
    expect(container.querySelector('.add-domestic')).toBeEmptyDOMElement();
    expect(container.querySelector('.buttonClick')).toBeEmptyDOMElement();
  });
});
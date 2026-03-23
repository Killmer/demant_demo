import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class MyDocument extends Document {
  render() {

    return (
      <Html lang={"en"} >
        <Head>
          <meta name="description" content="My Business" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

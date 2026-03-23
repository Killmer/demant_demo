import 'styles/globals.scss';
import { ReactElement } from 'react';
import { openSans } from 'styles/fonts/fonts';

const App = ({ Component, pageProps }: any): ReactElement => {

  return (
    <>
      <style jsx global>{`
          :root {
              --font-open-sans: ${openSans.style.fontFamily};
          }
      `}</style>
      <Component {...pageProps} />
    </>
  );
};
export default App;

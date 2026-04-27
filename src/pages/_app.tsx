import 'styles/globals.scss';
import { ReactElement } from 'react';
import { openSans } from 'styles/fonts/fonts';
import { ModalProvider } from 'context/ModalContext';

const App = ({ Component, pageProps }: any): ReactElement => {

  return (
    <>
      <style jsx global>{`
          :root {
              --font-open-sans: ${openSans.style.fontFamily};
          }
      `}</style>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </>
  );
};
export default App;

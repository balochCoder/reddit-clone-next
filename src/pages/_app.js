import '@/styles/globals.css'
import {RecoilRoot} from "recoil";
import {ChakraProvider} from "@chakra-ui/react";
import Layout from "@/components/Layout/Layout";
import {theme} from "@/chakra/theme";


const App = ({Component, pageProps}) => {
    return (
        <RecoilRoot>
            <ChakraProvider theme={theme}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </RecoilRoot>
    );
};

export default App;

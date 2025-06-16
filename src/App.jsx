import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Path from "./routes/Path";
import { Toaster } from "react-hot-toast";
import ContactDiv from "./components/ui/Contact";
import NavBar from "./components/ui/NavBar";
import CartAlert from "./components/ui/CartAlert";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />
      <ContactDiv />
      <NavBar />
      <Path />
      <CartAlert />
    </QueryClientProvider>
  );
};

export default App;

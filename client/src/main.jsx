import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Farmermain from "./OwnComponets/farmer/Farmermain";
import FarmerHomePage from "./OwnComponets/farmer/FarmerHomepage";
import { CropForm } from "./OwnComponets/farmer/FarmerCropListingPage";
import MarketplacePage from "./OwnComponets/buyer/Marketplace";
import ListedCropView from "./OwnComponets/farmer/ListedcropView";
import AllListedCrops from "./OwnComponets/farmer/Alllisted";
import { ContractProvider } from "./ContractContext/ContractContext";
import AddRolePage from "./OwnComponets/utils/Addrolepage";
import App from "./App";
import { ThemeProvider } from "./OwnComponets/utils/TheamProvider";
import CropVerificationPage from "./OwnComponets/LocalAgents/CropVerficatiion"; // Assume this is the page where agents verify crops
import LocalagentMainpage from "./OwnComponets/LocalAgents/LocalagentMainpage";
import AgentHomePage from "./OwnComponets/LocalAgents/AgentHomePage";
import Buyermain from "./OwnComponets/buyer/Buyermain";
import BuyerHomePage from "./OwnComponets/buyer/BuyerHomePage";
import CropViewPage from "./OwnComponets/buyer/CropViewPage";
import PurchasePage from "./OwnComponets/buyer/PurchasePage";
import TrackOrders from "./OwnComponets/buyer/TrackOrders";
import AuctionPage from "./OwnComponets/utils/AuctionPage";
import { Toaster } from "react-hot-toast";
import FarmerMarketplace from "./OwnComponets/farmer/FarmerMarketplace";
const PUBLISHABLE_KEY =
  "pk_test_cHJvdWQtc2t1bmstMjEuY2xlcmsuYWNjb3VudHMuZGV2JA";

// Utility component to protect routes based on role
const RequireRole = ({ role, children }) => {
  const { user } = useUser();

  // If user role doesn't match, deny access
  if (user?.publicMetadata?.role !== role) {
    return <div>Access denied. You do not have the required permissions.</div>;
  }

  return children;
};

// Define the routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <SignedIn>
          <App />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
    children: [
      {
        path: "farmer",
        element: <Farmermain />,
        children: [
          { path: "home", element: <FarmerHomePage /> },
          { path: "listcrops", element: <CropForm /> },
          { path: "marketplace", element: <FarmerMarketplace /> },
          { path: "listedcropview/:cropId", element: <ListedCropView /> },
          { path: "alllistedcrops", element: <AllListedCrops /> },
        ],
      },
      {
        path:"localagent",
        element:<LocalagentMainpage/>,
        children:[
          {path:"home", element:<AgentHomePage/>},
          { path:"verifycrops" ,element:<CropVerificationPage/>}
        ]
      },
      {
        path:"buyer",
        element:<Buyermain/>,
        children:[
          {path:"home", element:<BuyerHomePage/>},
          {path:"viewcrops",element:<CropViewPage/>},
          {path:"purchase-history",element:<PurchasePage/>},
          {path:"track-orders",element:<TrackOrders/>}
        ]
      }
      ,
          {
            path:"auction",
            element:<AuctionPage/>
          },
      {
        path: "verifycrops",
        element: (
          <RequireRole role="localAgent">
            <CropVerificationPage />
          </RequireRole>
        ),
      },
    ],
  },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/addyourrole", element: <AddRolePage /> },
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="light">
    <Provider store={store}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        theme="dark"
      >
        <ContractProvider>
          <RouterProvider router={router} />
          <Toaster />
          
        </ContractProvider>
      </ClerkProvider>
    </Provider>
  </ThemeProvider>
);

import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { albums, book, camera } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import SettingsPage from "./pages/SettingsPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import CrosswordPage from "./pages/CrosswordPage";
import SentencesPage from "./pages/SentencesPage";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/identify">
            <Tab1 />
          </Route>
          <Route exact path="/archive">
            <Tab2 />
          </Route>
          <Route exact path="/study">
            <Tab3 />
          </Route>
          <Route exact path="/settings">
            <SettingsPage />
          </Route>
          <Route exact path="/flashcards">
            <FlashcardsPage />
          </Route>
          <Route exact path="/crossword">
            <CrosswordPage />
          </Route>
          <Route exact path="/sentences">
            <SentencesPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/identify" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/identify">
            <IonIcon aria-hidden="true" icon={camera} />
            <IonLabel>Identify</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/archive">
            <IonIcon aria-hidden="true" icon={albums} />
            <IonLabel>Archive</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/study">
            <IonIcon aria-hidden="true" icon={book} />
            <IonLabel>Study</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;

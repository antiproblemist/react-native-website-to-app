import { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  View,
  BackHandler,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import {WEBSITE_NAME, WEBSITE_URL} from "@env"

export default function Website({ navigation }) {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const handleBackButtonPress = () => {
    webViewRef.current.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonPress
      );
    };
  }, []);

  useEffect(() => {
    if (canGoBack) {
      navigation.setOptions({
        headerLeft: () => (
          <Text
            onPress={() => webViewRef.current.goBack()}
            style={styles.backButton}
          >
            Back
          </Text>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => {
          return;
        },
      });
    }
  }, [canGoBack]);

  useEffect(() => {
    if (pageLoading) {
      navigation.setOptions({
        title: "Loading...",
      });
    } else {
      navigation.setOptions({
        title: WEBSITE_NAME,
      });
    }
  }, [pageLoading]);

  backButtonHandler = () => {
    if (webViewRef.current) webViewRef.current.goBack();
  };

  frontButtonHandler = () => {
    if (webViewRef.current) webViewRef.current.goForward();
  };

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle="light-content"
        showHideTransition="slide"
        hidden={false}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: WEBSITE_URL }}
          startInLoadingState
          renderLoading={() => (
            <View style={{ flex: 1, alignItems: "center" }}>
              <ActivityIndicator color="black" size="large" />
            </View>
          )}
          ref={webViewRef}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setPageLoading(navState.loading);
          }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  tabBarContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#b43757",
  },
  backButton: {
    color: "black",
    fontSize: 16,
    paddingRight: 10,
  },
});

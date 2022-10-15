import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { push, ref, onValue, remove } from "firebase/database";
import { database } from "./firebase.js";
import { StyleSheet, View, FlatList } from "react-native";
import { Header, Icon, Input, ListItem, Button } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, "/items");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const items = data
        ? Object.keys(data).map((key) => ({ key, ...data[key] }))
        : [];
      setItems(items);
    });
  }, []);

  const handleSave = () => {
    if (product.length > 0) {
      push(ref(database, "/items"), { Product: product, Amount: amount });
      setProduct("");
      setAmount("");
    }
  };

  const handleDelete = (item) => {
    remove(ref(database, "/items/" + item.key));
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Header
          containerStyle={styles.headerContainer}
          centerComponent={{ text: "SHOPPING LIST", style: styles.headerText }}
        />
        <View style={styles.inputContainer}>
          <Input
            style={styles.input}
            onChangeText={(text) => setProduct(text)}
            value={product}
            label="Product"
          />
          <Input
            style={styles.input}
            onChangeText={(text) => setAmount(text)}
            value={amount}
            label="Amount"
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            type="clear"
            title="Add"
            icon={<Icon name="push-pin" size={24} color="#424463" />}
            titleStyle={{ color: "#424463" }}
            onPress={handleSave}
          />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <ListItem topDivider>
                <ListItem.Content style={styles.list}>
                  <View>
                    <ListItem.Title>{item.Product}</ListItem.Title>
                    <ListItem.Subtitle>{item.Amount}</ListItem.Subtitle>
                  </View>
                  <Icon
                    name="delete-outline"
                    onPress={() => handleDelete(item)}
                  ></Icon>
                </ListItem.Content>
              </ListItem>
            )}
          />
        </View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    backgroundColor: "#424463",
    paddingTop: 0,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  inputContainer: {
    width: "50%",
    marginTop: 20,
  },
  input: {
    color: "#424463",
  },
  btnContainer: {
    marginTop: 5,
    marginBottom: 20,
  },
  listContainer: {
    width: "90%",
    display: "flex",
    maxHeight: 250,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

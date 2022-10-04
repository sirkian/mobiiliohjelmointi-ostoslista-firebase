import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { push, ref, onValue, remove } from "firebase/database";
import { database } from "./firebase.js";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button,
} from "react-native";

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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProduct(text)}
        value={product}
        placeholder="Product"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setAmount(text)}
        value={amount}
        placeholder="Amount"
      />
      <View style={styles.btnContainer}>
        <Button title="ADD" onPress={handleSave} />
      </View>
      <View style={styles.listContainer}>
        {items.length > 0 ? (
          <Text style={styles.text}>Shopping List</Text>
        ) : (
          <Text style={styles.textSecondary}>List empty.</Text>
        )}
        <FlatList
          data={items}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.list}>
              <Text>
                {item.Product}, {item.Amount}
              </Text>
              <Text
                style={styles.textSecondary}
                onPress={() => handleDelete(item)}
              >
                Delete
              </Text>
            </View>
          )}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    width: 200,
    height: 40,
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 7,
  },
  btnContainer: {
    flexDirection: "row",
    margin: 10,
  },
  text: {
    fontSize: 18,
    margin: 8,
  },
  textSecondary: {
    color: "darkgrey",
    marginLeft: 5,
  },
  listContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: 3,
  },
  list: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
});

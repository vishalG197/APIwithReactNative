import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'https://monkeyapi-2-0.onrender.com/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const newUser = { name, email, password };
      const response = await axios.post(API_URL, newUser);
      setUsers([...users, response.data]);
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async (id) => {
    try {
      const editedUser = { name, email, password };
      await axios.put(`${API_URL}/${id}`, editedUser);
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          return { ...user, ...editedUser };
        }
        return user;
      });
      setUsers(updatedUsers);
      setName('');
      setEmail('');
      setPassword('');
      setEditingUserId(null);
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setEditingUserId(user.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Button
          title={editingUserId ? 'Update User' : 'Add User'}
          onPress={editingUserId ? () => handleEditUser(editingUserId) : handleAddUser}
        />
      </View>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" onPress={() => handleDeleteUser(item.id)} />
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

/**
 * Exports the main component of the User Management App.
 */
export default App;

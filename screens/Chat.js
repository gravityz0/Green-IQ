import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Mock data for demonstration
const MOCK_MESSAGES = [
  {
    id: '1',
    text: 'Welcome to our collection point chat! How can we help you today?',
    sender: 'manager',
    senderName: 'Rukundo Furaha',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'text',
    status: 'read',
    reactions: [],
    isForwarded: false,
  },
  {
    id: '2',
    text: 'Hi! I have some questions about waste collection.',
    sender: 'user',
    senderName: 'You',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    type: 'text',
    status: 'read',
    reactions: [],
    isForwarded: false,
  },
  {
    id: '3',
    text: 'Sure! What would you like to know?',
    sender: 'manager',
    senderName: 'Rukundo Furaha',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    type: 'text',
    status: 'read',
    reactions: [],
    isForwarded: false,
  },
  {
    id: '4',
    text: 'What types of waste do you accept?',
    sender: 'user',
    senderName: 'You',
    timestamp: new Date(Date.now() - 3300000).toISOString(),
    type: 'text',
    status: 'read',
    reactions: [],
  },
  {
    id: '5',
    text: 'We accept recyclable wastes, plastic, paper, and metal. Here\'s our schedule:',
    sender: 'manager',
    senderName: 'Rukundo Furaha',
    timestamp: new Date(Date.now() - 3200000).toISOString(),
    type: 'text',
    status: 'read',
    reactions: [],
  },
  {
    id: '6',
    text: 'Mon-Sat: 7:00 AM - 6:00 PM',
    sender: 'manager',
    senderName: 'Rukundo Furaha',
    timestamp: new Date(Date.now() - 3100000).toISOString(),
    type: 'text',
    status: 'read',
    reactions: [],
  },
];

const MOCK_USERS = {
  manager: {
    id: 'manager1',
    name: 'Rukundo Furaha',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Collection Point Manager',
    online: true,
    lastSeen: new Date(Date.now() - 300000).toISOString(),
    status: 'Available',
  },
  user: {
    id: 'user1',
    name: 'You',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'User',
    online: true,
    lastSeen: new Date().toISOString(),
    status: 'Available',
  },
};

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const Chat = ({ route, navigation }) => {
  const { collectionPoint, pointName, pointManager } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [forwardMessage, setForwardMessage] = useState(null);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageOptionsAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      title: pointName,
      headerStyle: {
        backgroundColor: '#2d6a4f',
      },
      headerTintColor: '#fff',
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('ChatInfo', { 
              user: MOCK_USERS.manager,
              collectionPoint 
            })}
          >
            <Ionicons name="information-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowMessageOptions(true)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage = {
        id: Date.now().toString(),
        type: 'image',
        imageUri: result.assets[0].uri,
        sender: 'user',
        senderName: 'You',
        timestamp: new Date().toISOString(),
        status: 'sending',
        reactions: [],
        isForwarded: false,
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Simulate image upload and sending
      setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent' }
              : msg
          )
        );
      }, 1000);
    }
  };

  const sendMessage = () => {
    if (message.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      senderName: 'You',
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sending',
      reactions: [],
      replyTo: replyTo,
      isForwarded: false,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');
    setReplyTo(null);
    handleTyping();

    // Simulate message sending and response
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message. We will get back to you shortly.',
          sender: 'manager',
          senderName: MOCK_USERS.manager.name,
          timestamp: new Date().toISOString(),
          type: 'text',
          status: 'read',
          reactions: [],
          isForwarded: false,
        };
        setMessages(prevMessages => [...prevMessages, response]);
      }, 2000);
    }, 1000);
  };

  const handleReaction = (messageId, reaction) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const reactions = [...(msg.reactions || [])];
          const existingIndex = reactions.findIndex(r => r.user === 'user');
          if (existingIndex >= 0) {
            reactions[existingIndex] = { user: 'user', reaction };
          } else {
            reactions.push({ user: 'user', reaction });
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    );
    setShowReactions(false);
  };

  const handleMessageLongPress = (message) => {
    setSelectedMessage(message);
    Animated.spring(messageOptionsAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setShowMessageOptions(true);
  };

  const handleForward = () => {
    if (selectedMessage) {
      setForwardMessage(selectedMessage);
      setShowMessageOptions(false);
      // Here you would typically show a contact list to forward to
      Alert.alert('Forward Message', 'Select a contact to forward to');
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      Alert.alert(
        'Delete Message',
        'Are you sure you want to delete this message?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setMessages(prevMessages =>
                prevMessages.filter(msg => msg.id !== selectedMessage.id)
              );
              setShowMessageOptions(false);
            },
          },
        ]
      );
    }
  };

  const renderMessageStatus = (status) => {
    switch (status) {
      case 'sending':
        return <ActivityIndicator size="small" color="#666" />;
      case 'sent':
        return <Ionicons name="checkmark" size={16} color="#666" />;
      case 'read':
        return <Ionicons name="checkmark-done" size={16} color="#2d6a4f" />;
      default:
        return null;
    }
  };

  const renderReactions = (reactions) => {
    if (!reactions || reactions.length === 0) return null;
    
    return (
      <View style={styles.reactionsContainer}>
        {reactions.map((reaction, index) => (
          <Text key={index} style={styles.reactionText}>
            {reaction.reaction}
          </Text>
        ))}
      </View>
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    const user = MOCK_USERS[item.sender];

    return (
      <Pressable
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.managerMessage
        ]}
        onLongPress={() => handleMessageLongPress(item)}
      >
        {!isUser && (
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.avatar}
          />
        )}
        <View style={styles.messageContent}>
          {!isUser && (
            <Text style={styles.senderName}>{user.name}</Text>
          )}
          {item.replyTo && (
            <View style={styles.replyContainer}>
              <Text style={styles.replyText}>
                Replying to {item.replyTo.senderName}
              </Text>
              <Text style={styles.replyMessageText}>
                {item.replyTo.text}
              </Text>
            </View>
          )}
          {item.isForwarded && (
            <View style={styles.forwardedContainer}>
              <Ionicons name="arrow-redo" size={12} color="#666" />
              <Text style={styles.forwardedText}>Forwarded</Text>
            </View>
          )}
          {item.type === 'image' ? (
            <Image 
              source={{ uri: item.imageUri }} 
              style={styles.messageImage}
            />
          ) : (
            <Text style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.managerMessageText
            ]}>
              {item.text}
            </Text>
          )}
          {renderReactions(item.reactions)}
          <View style={styles.messageFooter}>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            {isUser && renderMessageStatus(item.status)}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
     

      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          keyboardShouldPersistTaps="handled"
        />
        
        {isTyping && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>
              {MOCK_USERS.manager.name} is typing...
            </Text>
          </View>
        )}
        
        {replyTo && (
          <View style={styles.replyBar}>
            <View style={styles.replyContent}>
              <Text style={styles.replyLabel}>Replying to {replyTo.senderName}</Text>
              <Text style={styles.replyPreview}>{replyTo.text}</Text>
            </View>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#2d6a4f" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            multiline
            onFocus={handleTyping}
            keyboardType="default"
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={sendMessage}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]} 
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={message.trim() ? "#fff" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showReactions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReactions(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowReactions(false)}
        >
          <View style={styles.reactionsModal}>
            {REACTIONS.map((reaction, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reactionButton}
                onPress={() => handleReaction(selectedMessage?.id, reaction)}
              >
                <Text style={styles.reactionEmoji}>{reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showMessageOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMessageOptions(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowMessageOptions(false)}
        >
          <Animated.View 
            style={[
              styles.messageOptionsModal,
              {
                transform: [{
                  translateY: messageOptionsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                }],
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.messageOption}
              onPress={() => {
                setReplyTo(selectedMessage);
                setShowMessageOptions(false);
              }}
            >
              <Ionicons name="arrow-undo" size={24} color="#666" />
              <Text style={styles.messageOptionText}>Reply</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.messageOption}
              onPress={handleForward}
            >
              <Ionicons name="arrow-redo" size={24} color="#666" />
              <Text style={styles.messageOptionText}>Forward</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.messageOption}
              onPress={() => {
                setShowReactions(true);
                setShowMessageOptions(false);
              }}
            >
              <Ionicons name="happy" size={24} color="#666" />
              <Text style={styles.messageOptionText}>React</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.messageOption, styles.deleteOption]}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={24} color="#ff3b30" />
              <Text style={[styles.messageOptionText, styles.deleteOptionText]}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2d6a4f',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    minHeight: 60,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '85%',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2d6a4f',
    borderRadius: 20,
    borderTopRightRadius: 4,
    marginLeft: 50,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  managerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderTopLeftRadius: 4,
    marginRight: 50,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageText: {
    color: '#fff',
  },
  managerMessageText: {
    color: '#333',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    padding: 12,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginRight: 4,
  },
  typingContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  typingText: {
    fontSize: 12,
    color: '#2d6a4f',
    fontStyle: 'italic',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2d6a4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  reactionsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -15,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  reactionText: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionsModal: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reactionButton: {
    padding: 10,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  replyContent: {
    flex: 1,
    marginRight: 10,
  },
  replyLabel: {
    fontSize: 12,
    color: '#2d6a4f',
    fontWeight: 'bold',
  },
  replyPreview: {
    fontSize: 14,
    color: '#666',
  },
  replyContainer: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2d6a4f',
  },
  replyText: {
    fontSize: 12,
    color: '#2d6a4f',
    fontWeight: 'bold',
  },
  replyMessageText: {
    fontSize: 12,
    color: '#666',
  },
  forwardedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  forwardedText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  messageOptionsModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  messageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageOptionText: {
    fontSize: 16,
    color: '#2d6a4f',
    marginLeft: 15,
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteOptionText: {
    color: '#ff3b30',
  },
});

export default Chat; 
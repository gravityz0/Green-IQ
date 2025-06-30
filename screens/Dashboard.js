import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced mock data with more comprehensive statistics
const mockStats = {
  collectionPointsCount: 24,
  itemsRecycled: 45872,
  activeUsers: 1247,
  monthlyGrowth: 12.5,
  co2Saved: 238.5, // tons
  pointsDistributed: 892340,
  topRecyclers: [
    { id: 1, name: 'EcoWarrior John', points: 15430, items: 245 },
    { id: 2, name: 'Green Sarah', points: 12890, items: 198 },
    { id: 3, name: 'RecyclePro Mike', points: 11250, items: 167 },
  ],
  recentActivities: [
    { id: 1, action: 'New collection point added', location: 'Gasabo District', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Maintenance scheduled', location: 'Kigali Central', time: '4 hours ago', type: 'warning' },
    { id: 3, action: 'Point capacity reached', location: 'Nyamirambo', time: '6 hours ago', type: 'error' },
    { id: 4, action: 'Weekly report generated', location: 'System', time: '1 day ago', type: 'info' },
  ],
  collectionPointsList: [
    { id: 1, name: 'Kigali Central Hub', status: 'Operational', capacity: 85, location: 'Central Kigali', dailyCollection: 245, coordinates: { lat: -1.9441, lng: 30.0619 } },
    { id: 2, name: 'Nyamirambo Station', status: 'Full', capacity: 100, location: 'Nyamirambo', dailyCollection: 189, coordinates: { lat: -1.9706, lng: 30.0588 } },
    { id: 3, name: 'Kimironko Center', status: 'Operational', capacity: 67, location: 'Kimironko', dailyCollection: 156, coordinates: { lat: -1.9355, lng: 30.1123 } },
    { id: 4, name: 'Remera Point', status: 'Maintenance', capacity: 45, location: 'Remera', dailyCollection: 98, coordinates: { lat: -1.9578, lng: 30.1066 } },
    { id: 5, name: 'Gikondo Industrial', status: 'Operational', capacity: 78, location: 'Gikondo', dailyCollection: 287, coordinates: { lat: -1.9884, lng: 30.0644 } },
    { id: 6, name: 'Nyabugogo Terminal', status: 'Operational', capacity: 92, location: 'Nyabugogo', dailyCollection: 134, coordinates: { lat: -1.9355, lng: 30.0588 } },
  ],
  weeklyData: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [235, 287, 356, 298, 445, 398, 234],
      color: (opacity = 1) => `rgba(45, 106, 79, ${opacity})`,
      strokeWidth: 3,
    }],
  },
  materialTypes: [
    { name: 'Plastic', population: 35, color: '#FF6B6B', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Glass', population: 25, color: '#4ECDC4', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Paper', population: 20, color: '#45B7D1', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Metal', population: 15, color: '#96CEB4', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Other', population: 5, color: '#FFEAA7', legendFontColor: '#333', legendFontSize: 12 },
  ],
};

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredPoints = useMemo(() => {
    return mockStats.collectionPointsList.filter(point =>
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const email = user?.email || '';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  if (!email.endsWith('@rca.com')) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#d9534f" />
        <View style={styles.deniedContainer}>
          <Ionicons name="shield-checkmark-outline" size={80} color="#d9534f" />
          <Text style={styles.deniedText}>Access Restricted</Text>
          <Text style={styles.deniedSub}>
            This government dashboard requires authorized RCA credentials.
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert('Contact', 'Please contact your system administrator for access.')}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handlePointPress = (point) => {
    setSelectedPoint(point);
    setModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational': return '#2d6a4f';
      case 'Full': return '#e67e22';
      case 'Maintenance': return '#f39c12';
      default: return '#d9534f';
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity >= 90) return '#e74c3c';
    if (capacity >= 70) return '#f39c12';
    return '#27ae60';
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View>
            {/* Key Metrics */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricsRow}>
                <View style={[styles.metricCard, styles.primaryCard]}>
                  <Ionicons name="location" size={28} color="#fff" />
                  <Text style={styles.metricValue}>{mockStats.collectionPointsCount}</Text>
                  <Text style={styles.metricLabel}>Collection Points</Text>
                </View>
                <View style={[styles.metricCard, styles.successCard]}>
                  <Ionicons name="leaf" size={28} color="#fff" />
                  <Text style={styles.metricValue}>{mockStats.itemsRecycled.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Items Recycled</Text>
                </View>
              </View>
              <View style={styles.metricsRow}>
                <View style={[styles.metricCard, styles.infoCard]}>
                  <Ionicons name="people" size={28} color="#fff" />
                  <Text style={styles.metricValue}>{mockStats.activeUsers.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Active Users</Text>
                </View>
                <View style={[styles.metricCard, styles.warningCard]}>
                  <Ionicons name="trending-up" size={28} color="#fff" />
                  <Text style={styles.metricValue}>+{mockStats.monthlyGrowth}%</Text>
                  <Text style={styles.metricLabel}>Monthly Growth</Text>
                </View>
              </View>
            </View>

            {/* Environmental Impact */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Environmental Impact</Text>
              <View style={styles.impactRow}>
                <View style={styles.impactItem}>
                  <Ionicons name="cloud" size={24} color="#27ae60" />
                  <Text style={styles.impactValue}>{mockStats.co2Saved} tons</Text>
                  <Text style={styles.impactLabel}>CO₂ Saved</Text>
                </View>
                <View style={styles.impactItem}>
                  <Ionicons name="star" size={24} color="#f39c12" />
                  <Text style={styles.impactValue}>{mockStats.pointsDistributed.toLocaleString()}</Text>
                  <Text style={styles.impactLabel}>Points Distributed</Text>
                </View>
              </View>
            </View>

            {/* Weekly Collection Chart */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Weekly Collection Trends</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={mockStats.weeklyData}
                  width={screenWidth - 60}
                  height={200}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(45, 106, 79, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#2d6a4f',
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </ScrollView>
            </View>
          </View>
        );

      case 'points':
        return (
          <View>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search collection points..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
            </View>

            {/* Collection Points List */}
            <FlatList
              data={filteredPoints}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pointCard} onPress={() => handlePointPress(item)}>
                  <View style={styles.pointHeader}>
                    <View style={styles.pointInfo}>
                      <Text style={styles.pointName}>{item.name}</Text>
                      <Text style={styles.pointLocation}>{item.location}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.pointMetrics}>
                    <View style={styles.pointMetric}>
                      <Text style={styles.metricNumber}>{item.capacity}%</Text>
                      <Text style={styles.metricText}>Capacity</Text>
                      <View style={styles.capacityBar}>
                        <View style={[styles.capacityFill, { 
                          width: `${item.capacity}%`, 
                          backgroundColor: getCapacityColor(item.capacity) 
                        }]} />
                      </View>
                    </View>
                    <View style={styles.pointMetric}>
                      <Text style={styles.metricNumber}>{item.dailyCollection}</Text>
                      <Text style={styles.metricText}>Daily Items</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'analytics':
        return (
          <View>
            {/* Material Distribution */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Material Distribution</Text>
              <PieChart
                data={mockStats.materialTypes}
                width={screenWidth - 60}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            {/* Top Recyclers */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Top Recyclers This Month</Text>
              {mockStats.topRecyclers.map((recycler, index) => (
                <View key={recycler.id} style={styles.recyclerRow}>
                  <View style={styles.recyclerRank}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.recyclerInfo}>
                    <Text style={styles.recyclerName}>{recycler.name}</Text>
                    <Text style={styles.recyclerStats}>
                      {recycler.points.toLocaleString()} points • {recycler.items} items
                    </Text>
                  </View>
                  <Ionicons name="trophy" size={20} color={index === 0 ? '#f1c40f' : index === 1 ? '#95a5a6' : '#cd7f32'} />
                </View>
              ))}
            </View>
          </View>
        );

      case 'activity':
        return (
          <View>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            {mockStats.recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]}>
                  <Ionicons name={getActivityIcon(activity.type)} size={20} color="#fff" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityLocation}>{activity.location}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'success': return '#27ae60';
      case 'warning': return '#f39c12';
      case 'error': return '#e74c3c';
      default: return '#3498db';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b4332" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Government Dashboard</Text>
          <Text style={styles.headerSubtitle}>Rwanda Recycling Management</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'overview', label: 'Overview', icon: 'analytics' },
            { key: 'points', label: 'Collection Points', icon: 'location' },
            { key: 'analytics', label: 'Analytics', icon: 'pie-chart' },
            { key: 'activity', label: 'Activity', icon: 'time' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Ionicons name={tab.icon} size={20} color={selectedTab === tab.key ? '#2d6a4f' : '#666'} />
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Point Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPoint && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPoint.name}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Status:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedPoint.status) }]}>
                      <Text style={styles.statusText}>{selectedPoint.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Location:</Text>
                    <Text style={styles.modalValue}>{selectedPoint.location}</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Capacity:</Text>
                    <Text style={styles.modalValue}>{selectedPoint.capacity}%</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Daily Collection:</Text>
                    <Text style={styles.modalValue}>{selectedPoint.dailyCollection} items</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="settings" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Manage Point</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1b4332',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#a8d5ba',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#2d6a4f',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2d6a4f',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  metricsContainer: {
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryCard: {
    backgroundColor: '#2d6a4f',
  },
  successCard: {
    backgroundColor: '#27ae60',
  },
  infoCard: {
    backgroundColor: '#3498db',
  },
  warningCard: {
    backgroundColor: '#f39c12',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b4332',
    marginBottom: 15,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactItem: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b4332',
    marginTop: 8,
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  pointCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  pointInfo: {
    flex: 1,
  },
  pointName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b4332',
  },
  pointLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pointMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointMetric: {
    flex: 1,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b4332',
  },
  metricText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  capacityBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 2,
  },
  recyclerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  recyclerRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  recyclerInfo: {
    flex: 1,
  },
  recyclerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recyclerStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b4332',
  },
  modalBody: {
    padding: 20,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  modalLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});

export default Dashboard; 
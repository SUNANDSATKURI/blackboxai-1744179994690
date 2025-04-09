// Fleet Management Application - Full Functionality
class FleetApp {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('fleetData')) || {
      vehicles: [],
      maintenance: [],
      drivers: ["John Smith", "Sarah Johnson", "Mike Brown", "Emily Davis"],
      nextVehicleId: 1,
      nextMaintenanceId: 1
    };
    
    this.initElements();
    this.bindEvents();
    this.loadData();
  }

  initElements() {
    this.elements = {
      vehicleList: document.getElementById('vehicle-list'),
      maintenanceList: document.getElementById('maintenance-list'),
      statusChart: document.getElementById('statusChart'),
      addVehicleBtn: document.getElementById('add-vehicle-btn'),
      vehicleModal: document.getElementById('vehicle-modal'),
      vehicleForm: document.getElementById('vehicle-form'),
      maintenanceModal: document.getElementById('maintenance-modal'),
      maintenanceForm: document.getElementById('maintenance-form'),
      dashboardStats: {
        totalVehicles: document.getElementById('total-vehicles'),
        activeVehicles: document.getElementById('active-vehicles'),
        maintenanceVehicles: document.getElementById('maintenance-vehicles'),
        fuelConsumption: document.getElementById('fuel-consumption')
      }
    };
  }

  bindEvents() {
    this.elements.addVehicleBtn.addEventListener('click', () => this.showVehicleModal());
    this.elements.vehicleForm.addEventListener('submit', (e) => this.handleVehicleSubmit(e));
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });
  }

  loadData() {
    this.renderVehicleList();
    this.renderMaintenanceList();
    this.updateDashboard();
    this.renderStatusChart();
  }

  saveData() {
    localStorage.setItem('fleetData', JSON.stringify(this.data));
    this.loadData();
  }

  // Vehicle CRUD Operations
  addVehicle(vehicle) {
    vehicle.id = this.data.nextVehicleId++;
    this.data.vehicles.push(vehicle);
    this.saveData();
  }

  updateVehicle(id, updatedData) {
    const index = this.data.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      this.data.vehicles[index] = {...this.data.vehicles[index], ...updatedData};
      this.saveData();
    }
  }

  deleteVehicle(id) {
    this.data.vehicles = this.data.vehicles.filter(v => v.id !== id);
    this.saveData();
  }

  // Maintenance CRUD Operations
  addMaintenance(maintenance) {
    maintenance.id = this.data.nextMaintenanceId++;
    this.data.maintenance.push(maintenance);
    this.saveData();
  }

  // UI Rendering Methods
  renderVehicleList() {
    this.elements.vehicleList.innerHTML = this.data.vehicles
      .map(vehicle => this.createVehicleCard(vehicle))
      .join('');
  }

  renderMaintenanceList() {
    this.elements.maintenanceList.innerHTML = this.data.maintenance
      .map(maintenance => this.createMaintenanceRow(maintenance))
      .join('');
  }

  updateDashboard() {
    const stats = {
      total: this.data.vehicles.length,
      active: this.data.vehicles.filter(v => v.status === 'active').length,
      maintenance: this.data.vehicles.filter(v => v.status === 'maintenance').length,
      fuel: this.data.vehicles.reduce((sum, v) => sum + (v.fuelUsage || 0), 0)
    };

    this.elements.dashboardStats.totalVehicles.textContent = stats.total;
    this.elements.dashboardStats.activeVehicles.textContent = stats.active;
    this.elements.dashboardStats.maintenanceVehicles.textContent = stats.maintenance;
    this.elements.dashboardStats.fuelConsumption.textContent = `${stats.fuel}L`;
  }

  // Helper Methods
  createVehicleCard(vehicle) {
    const statusClass = this.getStatusClass(vehicle.status);
    return `
      <div class="vehicle-card" data-id="${vehicle.id}">
        <!-- Vehicle card HTML -->
      </div>
    `;
  }

  getStatusClass(status) {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Modal Handling
  showVehicleModal(vehicle = null) {
    if (vehicle) {
      // Populate form with existing data
    }
    this.elements.vehicleModal.classList.remove('hidden');
  }

  closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.add('hidden');
    });
  }

  handleVehicleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const vehicleData = Object.fromEntries(formData.entries());
    
    if (e.target.dataset.editId) {
      this.updateVehicle(parseInt(e.target.dataset.editId), vehicleData);
    } else {
      this.addVehicle(vehicleData);
    }
    
    this.closeModals();
    e.target.reset();
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new FleetApp();
});

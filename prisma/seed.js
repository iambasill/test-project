const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

// --- Data Arrays ---
const conditionStatuses = ["S", "O", "A", "B", "C"]; // New enum
const acquisitionMethods = ["PURCHASE", "LEASE", "DONATION", "TRANSFER", "OTHER"];

// --- Expanded Equipment Types ---
const equipmentTypes = [
  "Vehicle",
  "Communication",
  "Radar",
  "Transport",
  "Surveillance",
  "Protective Gear",
  "Office Equipment",
  "IT Equipment",
  "Furniture",
  "Appliance"
];

// --- Equipment Categories ---
const equipmentCategories = {
  Vehicle: ["Patrol Car", "SUV", "Truck", "Motorcycle", "Armored Vehicle"],
  Communication: ["Radio", "Satellite Phone", "Intercom System", "Dispatch System"],
  Radar: ["Speed Detection", "Surveillance", "Weather"],
  Transport: ["Personnel Carrier", "Prisoner Transport", "Utility Vehicle"],
  Surveillance: ["Camera", "Drone", "Audio Surveillance"],
  "Protective Gear": ["Body Armor", "Helmet", "Gas Mask", "Shield"],
  "Office Equipment": ["Printer", "Scanner", "Photocopier", "Projector", "Fax Machine"],
  "IT Equipment": ["Desktop Computer", "Laptop", "Server", "Router", "Switch"],
  Furniture: ["Office Chair", "Desk", "Filing Cabinet", "Conference Table", "Bookshelf"],
  Appliance: ["Refrigerator", "Microwave", "Air Conditioner", "Water Dispenser", "Fan"]
};

// --- Manufacturers & Models ---
const manufacturers = [
  "Toyota", "Siemens", "Colt", "Raytheon", "Mercedes", "Motorola", "3M",
  "HP", "Dell", "Canon", "LG", "Samsung", "Haier", "IKEA"
];

const models = {
  Vehicle: ["Land Cruiser", "Hilux", "Patrol", "Prado"],
  Communication: ["XTN446", "GP328", "PR860", "TK-3230"],
  Radar: ["AN/MPQ-64", "Ground Master 400", "AR-327"],
  Transport: ["Unimog", "Zetros", "Actros"],
  Surveillance: ["Drone DJI M300", "Thermal Camera X20"],
  "Protective Gear": ["Vest Level IV", "Helmet Advanced", "Gas Mask M50"],
  "Office Equipment": ["LaserJet Pro 400", "ScanJet 200", "PIXMA G6020", "Epson L3250"],
  "IT Equipment": ["OptiPlex 7090", "EliteBook 850", "PowerEdge R540", "TP-Link Archer AX6000"],
  Furniture: ["Markus Chair", "Bekant Desk", "Galant Cabinet", "Micke Table"],
  Appliance: ["GR-B202SQBB", "MC32K7055CK", "HWM75-707NZP", "Hisense REF100DR"]
};

const countries = ["Nigeria", "USA", "Germany", "Japan", "China", "Israel", "Sweden", "South Korea"];

// --- MAIN FUNCTION ---
async function main() {
  console.log("🌱 Seeding database with platform admin and equipment inventory...");

  // --- Clear Tables ---
  await prisma.document.deleteMany();
  await prisma.equipmentCondition.deleteMany();
  await prisma.equipmentOwnership.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.exteriorInspection.deleteMany();
  await prisma.interiorInspection.deleteMany();
  await prisma.mechanicalInspection.deleteMany();
  await prisma.functionalInspection.deleteMany();
  await prisma.documentLegalInspection.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.user_sessions.deleteMany();
  await prisma.active_admin_sessions.deleteMany();
  await prisma.user.deleteMany();

  // --- Create Platform Admin ---
  const admin = await prisma.user.create({
    data: {
      email: "platform-admin@gmail.com",
      firstName: "Platform",
      lastName: "Administrator",
      role: "PLATADMIN",
      status: "PENDING",
      password: "Password1",
      isActive: true,
      serviceNumber: "SN-ADM-001",
      rank: "Chief Superintendent",
      unit: "Headquarters"
    },
  });
  console.log("✅ Platform Admin created");

  // --- Create 50 Mixed Equipment Items ---
  const allEquipments = [];
  for (let i = 1; i <= 50; i++) {
    const type = equipmentTypes[i % equipmentTypes.length];
    const categoryOptions = equipmentCategories[type] || ["Standard"];
    const category = categoryOptions[i % categoryOptions.length];
    const modelOptions = models[type] || ["Standard Model"];
    const model = modelOptions[i % modelOptions.length];

    const acquisitionDate = new Date();
    acquisitionDate.setFullYear(acquisitionDate.getFullYear() - (i % 4));

    const equipment = await prisma.equipment.create({
      data: {
        chasisNumber: `CHS-${2023000 + i}`,
        equipmentName: `${category} ${model}`,
        model: model,
        equipmentType: type,
        equipmentCategory: category,
        manufacturer: manufacturers[i % manufacturers.length],
        modelNumber: `MOD-${type.substring(0, 3).toUpperCase()}-${100 + i}`,
        yearOfManufacture: `${2019 + (i % 5)}`,
        countryOfOrigin: countries[i % countries.length],
        dateOfAcquisition: acquisitionDate.toISOString().split('T')[0],
        acquisitionMethod: acquisitionMethods[i % acquisitionMethods.length],
        supplierInfo: `${manufacturers[i % manufacturers.length]} ${i % 2 ? "Ltd" : "Inc"}`,
        purchaseOrderNumber: `PO-${2023000 + i}`,
        costValue: `${80000 + (i * 55000)}`,
        currency: "NGN",
        fundingSource: i % 2 === 0 ? "Federal Allocation" : "State Budget",
        weight: i % 2 === 0 ? `${50 + (i * 5)}kg` : null,
        dimensions: i % 2 === 0 ? `${50 + i}cm x ${40 + i}cm x ${30 + i}cm` : null,
        powerRequirements: ["Office Equipment", "IT Equipment", "Appliance"].includes(type)
          ? "220V AC"
          : null,
        fuelType: type === "Vehicle" ? (i % 2 === 0 ? "Petrol" : "Diesel") : null,
        operationalSpecs: "Standard operational specifications apply",
        currentCondition: conditionStatuses[i % conditionStatuses.length],
        lastConditionCheck: new Date().toISOString(),
      },
    });

    allEquipments.push(equipment);
  }

  console.log(`✅ Created ${allEquipments.length} equipment items`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClientClient } = require('../build/lib/prisma-connect');
// --- Fake Data Arrays ---
const conditionStatuses = ["S", "O", "A", "B", "C"];
const acquisitionMethods = ["PURCHASE", "LEASE", "DONATION", "TRANSFER", "OTHER"];

// --- Equipment Types ---
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

// --- Categories ---
const equipmentCategories = {
  Vehicle: ["Patrol Unit", "Terrain Vehicle", "Utility Rover", "Command Vehicle"],
  Communication: ["Field Radio", "Signal Relay", "Comm Hub", "Secure Transmitter"],
  Radar: ["Target Scanner", "Wide Sweep Radar", "MicroPulse Radar"],
  Transport: ["Personnel Carrier", "Cargo Module", "Multi-Load Transport"],
  Surveillance: ["Recon Drone", "Thermal Camera", "Silent Observer"],
  "Protective Gear": ["Armor Vest", "Shock Helmet", "Air Filtration Mask"],
  "Office Equipment": ["Laser Printer", "Doc Scanner", "Copy Machine", "Digital Projector"],
  "IT Equipment": ["Workstation", "Mobile Terminal", "Rack Server", "Network Hub"],
  Furniture: ["Ergo Chair", "Work Desk", "Filing Cabinet", "Command Table"],
  Appliance: ["Cooling Unit", "Heat Processor", "Air Purifier", "Hydro Dispenser"]
};

// --- FAKE Manufacturers ---
const manufacturers = [
  "Novatek Industries",
  "Auron Systems",
  "Skyforge Dynamics",
  "Vortex Solutions",
  "HexaTech Labs",
  "Omnistar Machines",
  "Coretrix Engineering",
  "Velonix Equipment",
  "Solara Devices",
  "Quantara Robotics",
  "Stratix Tools",
  "Aerion Techworks",
  "Lumera Products",
  "Metronix Fabricators"
];

// --- FAKE Models ---
const models = {
  Vehicle: ["VX-7 Ranger", "HX-4 Strider", "PX-9 Cruiser", "AX-3 Sentinel"],
  Communication: ["ComLink-X1", "EchoWave-200", "SignalPro M5", "UltraComm S9"],
  Radar: ["RDR-450 Sentinel", "RDR-920 SkyScan", "RDR-300 TerraTrack"],
  Transport: ["TRX-100 Carrier", "Moveron T7", "Loadmax P3"],
  Surveillance: ["AeroCam V8", "Spectra View 300", "SilentEye X2"],
  "Protective Gear": ["GuardPro V4", "HelioShield M3", "SafeMask-55"],
  "Office Equipment": ["Printon L500", "Scanex M100", "CopyLite 220", "ProJet X4"],
  "IT Equipment": ["DataCore S7", "NetBox Z9", "ComputeMax 500", "LogicOne R2"],
  Furniture: ["FlexiChair 720", "WorkDesk Pro", "Cabinetron 40", "TableX 100"],
  Appliance: ["CoolBreeze 900", "HeatWave M300", "PureFlow 75", "ChillBox 120"]
};

const countries = ["Nigeria", "USA", "Germany", "Japan", "China", "Israel", "Sweden", "South Korea"];

// --- MAIN FUNCTION ---
async function main() {
  console.log("🌱 Seeding database with platform admin and equipment inventory...");


  const totalCount = 80; // 50 original + 30 extra

  const allEquipments = [];
  for (let i = 1; i <= totalCount; i++) {
    const type = equipmentTypes[i % equipmentTypes.length];
    const categoryOptions = equipmentCategories[type] || ["Standard"];
    const category = categoryOptions[i % categoryOptions.length];
    const modelOptions = models[type] || ["Model-X"];
    const model = modelOptions[i % modelOptions.length];

    const acquisitionDate = new Date();
    acquisitionDate.setFullYear(acquisitionDate.getFullYear() - (i % 4));

    const equipment = await PrismaClient.equipment.create({
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
        dateOfAcquisition: acquisitionDate.toISOString().split("T")[0],
        acquisitionMethod: acquisitionMethods[i % acquisitionMethods.length],
        supplierInfo: `${manufacturers[i % manufacturers.length]} ${i % 2 ? "Ltd" : "Corp"}`,
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
        lastConditionCheck: new Date().toISOString()
      }
    });

    allEquipments.push(equipment);
  }

  console.log(`✅ Created ${allEquipments.length} equipment items (all synthetic)`);

}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await PrismaClient.$disconnect();
  });

const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

// Data arrays for seeding
const conditionStatuses = ["EXCELLENT", "GOOD", "FAIR", "POOR", "FAILED", "NOT_APPLICABLE"];
const acquisitionMethods = ["PURCHASE", "LEASE", "DONATION", "TRANSFER", "OTHER"];
const equipmentTypes = ["Vehicle", "Communication", "Weapon", "Radar", "Transport", "Surveillance", "Protective Gear"];
const equipmentCategories = {
  Vehicle: ["Patrol Car", "SUV", "Truck", "Motorcycle", "Armored Vehicle"],
  Communication: ["Radio", "Satellite Phone", "Intercom System", "Dispatch System"],
  Weapon: ["Rifle", "Pistol", "Shotgun", "Non-Lethal"],
  Radar: ["Speed Detection", "Surveillance", "Weather"],
  Transport: ["Personnel Carrier", "Prisoner Transport", "Utility Vehicle"],
  Surveillance: ["Camera", "Drone", "Audio Surveillance"],
  "Protective Gear": ["Body Armor", "Helmet", "Gas Mask", "Shield"]
};
const manufacturers = ["Toyota", "Siemens", "Colt", "Raytheon", "Mercedes", "Motorola", "3M"];
const models = {
  Vehicle: ["Land Cruiser", "Hilux", "Patrol", "Prado"],
  Communication: ["XTN446", "GP328", "PR860", "TK-3230"],
  Weapon: ["M4 Carbine", "AK-47", "Glock 17", "MP5"],
  Radar: ["AN/MPQ-64", "Ground Master 400", "AR-327"],
  Transport: ["Unimog", "Zetros", "Actros"],
  Surveillance: ["Drone DJI M300", "Thermal Camera X20"],
  "Protective Gear": ["Vest Level IV", "Helmet Advanced", "Gas Mask M50"]
};
const countries = ["Nigeria", "USA", "Germany", "Japan", "China", "Israel"];
const officerRoles = ["Patrol", "SWAT", "K9", "Traffic", "Detective", "Bomb Squad"];
const userRanks = ["Inspector", "Sergeant", "Corporal", "Captain", "Lieutenant"];
const userUnits = ["Lagos Command", "Abuja Division", "Kano Unit", "Rivers Division"];

// Create realistic condition progression
const conditionDegradation = {
  EXCELLENT: ["EXCELLENT", "GOOD"],
  GOOD: ["GOOD", "FAIR"],
  FAIR: ["FAIR", "POOR"],
  POOR: ["POOR", "FAILED"],
  FAILED: ["FAILED"],
  NOT_APPLICABLE: ["NOT_APPLICABLE"]
};

async function main() {
  console.log("🌱 Seeding database with schema-compliant data...");

  // Clear existing data
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

  // --- Create Base Users ---
  const platAdmin = await prisma.user.create({
    data: {
      email: "platform-admin@gmail.com",
      firstName: "Platform",
      lastName: "Administrator",
      role: "PLATADMIN",
      status: "PENDING",
      password: "Password1", // Simulated hashed password
      isActive: true,
      serviceNumber: "SN-ADM-001",
      rank: "Chief Superintendent",
      unit: "Headquarters"
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      firstName: "System",
      lastName: "Admin",
      role: "ADMIN",
      status: "ACTIVE",
      password: "$2b$10$exampleHashedPassword123",
      isActive: true,
      serviceNumber: "SN-ADM-002",
      rank: "Superintendent",
      unit: "IT Department"
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@example.com",
      firstName: "Operations",
      lastName: "Manager",
      role: "MANAGER",
      status: "ACTIVE",
      password: "$2b$10$exampleHashedPassword123",
      isActive: true,
      serviceNumber: "SN-MGR-001",
      rank: "Inspector",
      unit: "Operations"
    },
  });

  const auditor = await prisma.user.create({
    data: {
      email: "auditor@example.com",
      firstName: "Compliance",
      lastName: "Auditor",
      role: "AUDITOR",
      status: "ACTIVE",
      password: "$2b$10$exampleHashedPassword123",
      isActive: true,
      serviceNumber: "SN-AUD-001",
      rank: "Sergeant",
      unit: "Internal Affairs"
    },
  });

  // --- Create 15 OFFICERS ---
  const officers = [];
  const officerNames = [
    {first: "James", last: "Smith"}, {first: "Maria", last: "Garcia"}, 
    {first: "David", last: "Johnson"}, {first: "Sarah", last: "Williams"},
    {first: "Michael", last: "Brown"}, {first: "Emily", last: "Jones"},
    {first: "Robert", last: "Miller"}, {first: "Jennifer", last: "Davis"},
    {first: "William", last: "Rodriguez"}, {first: "Elizabeth", last: "Martinez"},
    {first: "John", last: "Hernandez"}, {first: "Linda", last: "Lopez"},
    {first: "Richard", last: "Gonzalez"}, {first: "Susan", last: "Wilson"},
    {first: "Joseph", last: "Anderson"}
  ];

  for (let i = 0; i < 15; i++) {
    const officer = await prisma.user.create({
      data: {
        email: `${officerNames[i].first.toLowerCase()}.${officerNames[i].last.toLowerCase()}@police.ng`,
        firstName: officerNames[i].first,
        lastName: officerNames[i].last,
        role: "OFFICER",
        status: "ACTIVE",
        password: "$2b$10$exampleHashedPassword123",
        isActive: true,
        serviceNumber: `SN-OFF-${1000 + i}`,
        rank: userRanks[i % userRanks.length],
        unit: userUnits[i % userUnits.length]
      },
    });
    officers.push(officer);
  }

  // --- Create Operators ---
  const operators = [];
  for (let i = 0; i < 10; i++) {
    const operator = await prisma.operator.create({
      data: {
        firstName: `Operator${i + 1}`,
        lastName: `Lastname${i + 1}`,
        email: `operator${i + 1}@police.ng`,
        serviceNumber: `OP-${1000 + i}`,
        rank: userRanks[i % userRanks.length],
        branch: userUnits[i % userUnits.length],
        position: "Equipment Operator",
        identificationType: "National ID",
        identificationId: `NIN-${1000000000 + i}`,
        officialEmailAddress: `operator${i + 1}@police.ng`,
        phoneNumber: `+23480${30000000 + i}`,
      },
    });
    operators.push(operator);
  }

  // --- Create 25 Equipments with realistic data ---
  const equipments = [];
  for (let i = 1; i <= 25; i++) {
    const type = equipmentTypes[i % equipmentTypes.length];
    const categoryOptions = equipmentCategories[type] || ["Standard"];
    const category = categoryOptions[i % categoryOptions.length];
    const modelOptions = models[type] || ["Standard Model"];
    const model = modelOptions[i % modelOptions.length];
    
    const acquisitionDate = new Date();
    acquisitionDate.setFullYear(acquisitionDate.getFullYear() - (i % 5));
    
    const equipment = await prisma.equipment.create({
      data: {
        chasisNumber: `CHS-${2023000 + i}`,
        equipmentName: `${category} ${model}`,
        model: model,
        equipmentType: type,
        equipmentCategory: category,
        manufacturer: manufacturers[i % manufacturers.length],
        modelNumber: `MOD-${type.substring(0, 3).toUpperCase()}-${100 + i}`,
        yearOfManufacture: `${2020 + (i % 4)}`,
        countryOfOrigin: countries[i % countries.length],
        dateOfAcquisition: acquisitionDate.toISOString().split('T')[0],
        acquisitionMethod: acquisitionMethods[i % acquisitionMethods.length],
        supplierInfo: `${manufacturers[i % manufacturers.length]} ${i % 2 ? "Ltd" : "Inc"}`,
        purchaseOrderNumber: `PO-${2023000 + i}`,
        costValue: `${500000 + (i * 125000)}`,
        currency: "NGN",
        fundingSource: i % 3 === 0 ? "Federal Allocation" : "State Budget",
        weight: i % 2 === 0 ? `${500 + (i * 50)}kg` : null,
        dimensions: i % 2 === 0 ? `${200 + i}cm x ${150 + i}cm x ${100 + i}cm` : null,
        powerRequirements: i % 4 === 0 ? "220V AC" : null,
        fuelType: type === "Vehicle" ? (i % 2 === 0 ? "Petrol" : "Diesel") : null,
        operationalSpecs: i % 3 === 0 ? "Standard operational specifications apply" : null,
        currentCondition: conditionStatuses[0], // Start with excellent condition
        lastConditionCheck: new Date().toISOString(),
      },
    });
    equipments.push(equipment);
  }

  // --- Create Equipment Ownerships ---
  const ownerships = [];
  for (let i = 0; i < equipments.length; i++) {
    const equipment = equipments[i];
    const operator = operators[i % operators.length];
    
    const ownership = await prisma.equipmentOwnership.create({
      data: {
        equipment: { connect: { chasisNumber: equipment.chasisNumber } },
        operator: { connect: { id: operator.id } },
        startDate: new Date(),
        isCurrent: true,
        primaryDuties: "Primary equipment operator",
        driverLicenseId: `DL-${8000000 + i}`,
        coFirstName: "Commanding",
        coLastName: "Officer",
        coEmail: "commander@police.ng",
        coPhoneNumber: "+2348012345678",
        conditionAtAssignment: "EXCELLENT",
        notes: `Assigned to ${operator.firstName} ${operator.lastName}`,
      },
    });
    ownerships.push(ownership);
  }

  // --- Create realistic inspections with condition progression ---
  for (const equipment of equipments) {
    // Each equipment gets 3-6 inspections over time
    const inspectionCount = 3 + Math.floor(Math.random() * 4);
    let currentCondition = "EXCELLENT"; // Start with excellent condition
    
    for (let j = 0; j < inspectionCount; j++) {
      // Select a random officer as inspector
      const inspectingOfficer = officers[Math.floor(Math.random() * officers.length)];
      
      // Determine next condition based on degradation pattern
      const possibleNextConditions = conditionDegradation[currentCondition];
      currentCondition = possibleNextConditions[Math.floor(Math.random() * possibleNextConditions.length)];
      
      const inspectionDate = new Date();
      inspectionDate.setMonth(inspectionDate.getMonth() - (inspectionCount - j));
      
      const nextDueDate = new Date(inspectionDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + 3);
      
      // Create the inspection
      const inspection = await prisma.inspection.create({
        data: {
          equipment: { connect: { id: equipment.id } },
          inspector: { connect: { id: inspectingOfficer.id } },
          datePerformed: inspectionDate,
          nextDueDate: nextDueDate,
          overallNotes: `Routine inspection #${j + 1} of ${equipment.equipmentName}`,
          exteriorInspections: {
            create: [
              { 
                itemName: "Body/Exterior", 
                condition: currentCondition, 
                notes: getExteriorNotes(currentCondition) 
              },
            ],
          },
          interiorInspections: {
            create: [
              { 
                itemName: "Seats/Upholstery", 
                condition: currentCondition, 
                notes: getInteriorNotes(currentCondition) 
              },
            ],
          },
          mechanicalInspections: {
            create: [
              { 
                itemName: "Engine/Motor", 
                condition: currentCondition, 
                notes: getMechanicalNotes(currentCondition) 
              },
            ],
          },
          functionalInspections: {
            create: [
              { 
                itemName: "Primary Function", 
                condition: currentCondition, 
                notes: "Operational" 
              },
            ],
          },
          documentLegalInspections: {
            create: [
              { 
                itemName: "Registration", 
                condition: j % 5 !== 0 ? "GOOD" : "POOR", 
                notes: j % 5 !== 0 ? "Current" : "Needs renewal" 
              },
            ],
          },
        },
      });

      // Add documents to the inspection
      await prisma.document.create({
        data: {
          url: `https://example.com/docs/${equipment.chasisNumber}-inspection-${j + 1}.pdf`,
          description: `Inspection Report #${j + 1}`,
          fileName: `${equipment.chasisNumber}-inspection-${j + 1}.pdf`,
          mimeType: "application/pdf",
          fileSize: 1024 * (j + 1),
          inspection: { connect: { id: inspection.id } }
        },
      });

      // Update equipment condition after each inspection
      await prisma.equipment.update({
        where: { id: equipment.id },
        data: { 
         lastConditionCheck: inspectionDate.toISOString()
        }
      });

      // Create equipment condition record - FIXED: use inspectionId field instead of inspection relation
      await prisma.equipmentCondition.create({
        data: {
          equipment: { connect: { chasisNumber: equipment.chasisNumber } },
          condition: currentCondition,
          notes: `Condition after routine inspection #${j + 1}`,
          date: inspectionDate,
          recordedBy: { connect: { id: inspectingOfficer.id } },
          inspectionId: inspection.id // Fixed: using inspectionId field instead of inspection relation
        },
      });
    }
  }

  // Create sessions
  await prisma.user_sessions.create({
    data: {
      user: { connect: { id: manager.id } },
      session_token: "manager-session-123",
      login_time: new Date(),
    },
  });
}
 

// Helper functions for realistic inspection notes
function getExteriorNotes(condition) {
  const notes = {
    EXCELLENT: "No visible damage or wear",
    GOOD: "Minor scratches, no structural issues",
    FAIR: "Visible wear, some scratches and dents",
    POOR: "Significant damage, rust spots visible",
    FAILED: "Extensive damage, unsafe for operation",
    NOT_APPLICABLE: "Not applicable for this equipment"
  };
  return notes[condition];
}

function getInteriorNotes(condition) {
  const notes = {
    EXCELLENT: "Clean, no wear visible",
    GOOD: "Minor wear on frequently used components",
    FAIR: "Visible wear, stains or minor damage",
    POOR: "Significant wear, torn upholstery",
    FAILED: "Extensive damage, unsafe or unusable",
    NOT_APPLICABLE: "Not applicable for this equipment"
  };
  return notes[condition];
}

function getMechanicalNotes(condition) {
  const notes = {
    EXCELLENT: "Runs perfectly, no issues detected",
    GOOD: "Minor issues, operates normally",
    FAIR: "Noticeable performance degradation",
    POOR: "Frequent problems, needs servicing",
    FAILED: "Non-operational, requires major repair",
    NOT_APPLICABLE: "Not applicable for this equipment"
  };
  return notes[condition];
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { prismaclient } = require('../build/lib/prisma-connect');
const bcrypt = require('bcryptjs');

// --- Fake Data Arrays ---
const conditionStatuses = ["S", "O", "A", "B", "C"];

// --- Equipment Data ---
const equipmentNames = [
  "Patrol Vehicle Alpha", "Communication Radio Beta", "Surveillance Drone Gamma",
  "Transport Truck Delta", "Radar System Epsilon", "Protective Vest Zeta",
  "Office Printer Eta", "Server Rack Theta", "Conference Table Iota",
  "Air Conditioning Unit Kappa"
];

const vehicleMakes = ["Toyota", "Ford", "Mercedes", "Nissan", "Honda"];
const vehicleTypes = ["SUV", "Sedan", "Truck", "Van", "Patrol Car"];
const colors = ["White", "Black", "Blue", "Silver", "Gray", "Green"];

// --- Inspection Categories ---
const inspectionCategories = [
  { title: "Safety Inspection", subCategories: ["Fire Safety", "Electrical Safety", "Emergency Exits"] },
  { title: "Vehicle Inspection", subCategories: ["Engine", "Brakes", "Tires", "Lights"] },
  { title: "Equipment Check", subCategories: ["Functionality", "Maintenance", "Calibration"] },
  { title: "Documentation Review", subCategories: ["Permits", "Insurance", "Compliance"] }
];

// --- MAIN FUNCTION ---
async function main() {
  console.log("🌱 Seeding database with platform admin and equipment inventory...");

  // 1. CREATE PLATFORM ADMIN
  const hashedPassword = await bcrypt.hash("Password1", 10);
  
  const platformAdmin = await prismaclient.user.create({
    data: {
      email: "platform-admin@gmail.com",
      firstName: "Platform",
      lastName: "Admin",
      password: hashedPassword,
      role: "PLATADMIN",
      status: "PENDING",
      isActive: true
    }
  });

  console.log(`✅ Created platform admin: ${platformAdmin.email}`);


  // 3. CREATE EQUIPMENT
  const totalCount = 80;
  const allEquipments = [];

  for (let i = 1; i <= totalCount; i++) {
    const equipment = await prismaclient.equipment.create({
      data: {
        chasisNumber: `CHSS-${2023000 + i}`,
        equipmentName: equipmentNames[i % equipmentNames.length],
        model: `Model-${2020 + (i % 5)}`,
        vehicleMake: i % 2 === 0 ? vehicleMakes[i % vehicleMakes.length] : null,
        vehicleType: i % 2 === 0 ? vehicleTypes[i % vehicleTypes.length] : null,
        yearOfManufacture: `${2018 + (i % 7)}`,
        color: colors[i % colors.length],
        registrationNumber: i % 3 === 0 ? `REG-${2023000 + i}` : null,
        currentCondition: conditionStatuses[i % conditionStatuses.length],
        addedById: platformAdmin.id
      }
    });

    allEquipments.push(equipment);
  }

  console.log(`✅ Created ${allEquipments.length} equipment items`);
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaclient.$disconnect();
  });
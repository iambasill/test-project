// prisma/seed.js

const { PrismaClient } = require("../src/generated/prisma");


const prisma = new PrismaClient() ;

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - be careful in production!)
  console.log('🗑️  Clearing existing data...');
  await prisma.document.deleteMany();
  await prisma.documentLegalInspection.deleteMany();
  await prisma.functionalInspection.deleteMany();
  await prisma.mechanicalInspection.deleteMany();
  await prisma.interiorInspection.deleteMany();
  await prisma.exteriorInspection.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.equipmentCondition.deleteMany();
  await prisma.equipmentOwnership.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users with all roles and statuses
  console.log('👥 Creating users...');
  const users = await Promise.all([
      prisma.user.create({
      data: {
        email: 'platform-admin@gmail.com',
        firstName: 'Admin',
        lastName: 'Admin',
        serviceNumber: 'NAF/2018/0012347',
        rank: 'Group Captain',
        unit: 'Nigerian Air Force Base Kainji',
        role: 'PLATADMIN',
        status: 'ACTIVE',
        password: '$2b$10$hashedpassword2',
        lastLogin: new Date('2025-08-13T16:30:00Z'),
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin1@military.gov.ng',
        firstName: 'Fatima',
        lastName: 'Abdullahi',
        serviceNumber: 'NAF/2018/001234',
        rank: 'Group Captain',
        unit: 'Nigerian Air Force Base Kainji',
        role: 'ADMIN',
        status: 'ACTIVE',
        password: '$2b$10$hashedpassword2',
        lastLogin: new Date('2025-08-13T16:30:00Z'),
      }
    }),
    prisma.user.create({
      data: {
        email: 'manager1@military.gov.ng',
        firstName: 'Chukwuma',
        lastName: 'Nwosu',
        serviceNumber: 'ARMY/2019/005678',
        rank: 'Lieutenant Colonel',
        unit: '81 Division Lagos',
        role: 'MANAGER',
        status: 'ACTIVE',
        password: '$2b$10$hashedpassword3',
        lastLogin: new Date('2025-08-12T10:15:00Z'),
      }
    }),
    prisma.user.create({
      data: {
        email: 'auditor1@military.gov.ng',
        firstName: 'Aisha',
        lastName: 'Bello',
        serviceNumber: 'NAVY/2020/009876',
        rank: 'Commander',
        unit: 'Naval Dockyard Lagos',
        role: 'AUDITOR',
        status: 'ACTIVE',
        password: '$2b$10$hashedpassword4',
        lastLogin: new Date('2025-08-11T14:20:00Z'),
      }
    }),
    prisma.user.create({
      data: {
        email: 'officer1@military.gov.ng',
        firstName: 'Ibrahim',
        lastName: 'Yusuf',
        serviceNumber: 'NAF/2021/112233',
        rank: 'Flight Lieutenant',
        unit: 'Nigerian Air Force Base Makurdi',
        role: 'OFFICER',
        status: 'ACTIVE',
        password: '$2b$10$hashedpassword5',
        lastLogin: new Date('2025-08-10T09:45:00Z'),
      }
    }),
    prisma.user.create({
      data: {
        email: 'suspended@military.gov.ng',
        firstName: 'John',
        lastName: 'Suspended',
        serviceNumber: 'ARMY/2020/998877',
        rank: 'Captain',
        unit: '3 Armoured Division Jos',
        role: 'OFFICER',
        status: 'SUSPENDED',
        password: '$2b$10$hashedpassword6',
        lastLogin: new Date('2025-07-15T11:30:00Z'),
      }
    }),
    prisma.user.create({
      data: {
        email: 'pending@military.gov.ng',
        firstName: 'Mary',
        lastName: 'Pending',
        serviceNumber: 'NAVY/2025/334455',
        rank: 'Lieutenant',
        unit: 'Naval Training Command Apapa',
        role: 'OFFICER',
        status: 'PENDING',
        password: '$2b$10$hashedpassword7',
        lastLogin: null,
      }
    })
  ]);

  // 2. Create Equipment with various conditions and types
  console.log('🚗 Creating equipment...');
  const equipmentList = await Promise.all([
    prisma.equipment.create({
      data: {
        chasisNumber: 'HILUX2024NAF001',
        equipmentName: 'Toyota Hilux Double Cab',
        model: 'Hilux 2.8 GD-6',
        equipmentType: 'Vehicle',
        equipmentCategory: 'Light Transport Vehicle',
        manufacturer: 'Toyota Motor Corporation',
        modelNumber: 'GUN126R',
        yearOfManufacture: '2024',
        countryOfOrigin: 'Thailand',
        dateOfAcquisition: '2024-06-15',
        acquisitionMethod: 'PURCHASE',
        supplierInfo: 'Coscharis Motors Limited, Lagos',
        purchaseOrderNumber: 'PO/NAF/2024/0156',
        contractReference: 'CT/VEH/2024/089',
        costValue: '28500000.00',
        currency: 'NGN',
        fundingSource: 'Federal Government Capital Vote',
        weight: '2080kg',
        dimensions: '5340mm x 1855mm x 1815mm',
        powerRequirements: '12V DC System',
        fuelType: 'Diesel',
        maximumRange: '800km',
        operationalSpecs: '4WD capability, suitable for rough terrain operations, maximum payload 1000kg, towing capacity 3500kg',
        requiredCertifications: 'ISO 9001:2015, SONCAP Certificate, CE Marking',
        environmentalConditions: 'Operating temperature: -10°C to +50°C, humidity up to 95%, dust ingress protection IP54',
        currentCondition: 'EXCELLENT',
        lastConditionCheck: '2024-08-10',
      }
    }),
    prisma.equipment.create({
      data: {
        chasisNumber: 'DEFENDER2024ARMY001',
        equipmentName: 'Land Rover Defender 110',
        model: 'Defender 110 X-Dynamic SE',
        equipmentType: 'Vehicle',
        equipmentCategory: 'Off-Road Vehicle',
        manufacturer: 'Jaguar Land Rover',
        modelNumber: 'L663-DYNAMIC-SE',
        yearOfManufacture: '2024',
        countryOfOrigin: 'United Kingdom',
        dateOfAcquisition: '2024-07-20',
        acquisitionMethod: 'PURCHASE',
        supplierInfo: 'Jaguar Land Rover Nigeria',
        purchaseOrderNumber: 'PO/ARMY/2024/0298',
        contractReference: 'CT/VEH/2024/156',
        costValue: '55000000.00',
        currency: 'NGN',
        fundingSource: 'Special Operations Budget',
        weight: '2394kg',
        dimensions: '5018mm x 2008mm x 1967mm',
        powerRequirements: '12V/24V Dual System',
        fuelType: 'Diesel',
        maximumRange: '650km',
        operationalSpecs: 'Advanced Terrain Response 2, Wade sensing, Air suspension, Approach angle 38°, Departure angle 40°',
        requiredCertifications: 'EU Type Approval, UNECE Regulation 79, Military Standard MIL-STD-810',
        environmentalConditions: 'All-weather capability, -40°C to +50°C, wading depth 900mm, sand and snow operations',
        currentCondition: 'GOOD',
        lastConditionCheck: '2024-08-12',
      }
    }),
    prisma.equipment.create({
      data: {
        chasisNumber: 'ISUZU2023NAVY001',
        equipmentName: 'Isuzu NPR Medium Duty Truck',
        model: 'NPR 70L 4x2',
        equipmentType: 'Vehicle',
        equipmentCategory: 'Medium Duty Truck',
        manufacturer: 'Isuzu Motors Limited',
        modelNumber: 'NPR70LG-4HK1TC',
        yearOfManufacture: '2023',
        countryOfOrigin: 'Japan',
        dateOfAcquisition: '2023-11-15',
        acquisitionMethod: 'LEASE',
        supplierInfo: 'Stallion NMN, Lagos',
        purchaseOrderNumber: 'PO/NAVY/2023/0445',
        contractReference: 'CT/LEASE/2023/078',
        costValue: '18500000.00',
        currency: 'NGN',
        fundingSource: 'Transport Fleet Budget',
        weight: '3495kg',
        dimensions: '6995mm x 2150mm x 2780mm',
        powerRequirements: '12V DC System',
        fuelType: 'Diesel',
        maximumRange: '500km',
        operationalSpecs: 'Payload capacity 5005kg, hydraulic tipping system, power steering, air brakes',
        requiredCertifications: 'SONCAP Approval, ADR Certificate for dangerous goods transport',
        environmentalConditions: 'Standard road conditions, -5°C to +40°C operating range',
        currentCondition: 'FAIR',
        lastConditionCheck: '2024-08-05',
      }
    }),
    prisma.equipment.create({
      data: {
        chasisNumber: 'GENERATOR2022ARMY001',
        equipmentName: 'Caterpillar Diesel Generator',
        model: 'CAT C18 500kVA',
        equipmentType: 'Generator',
        equipmentCategory: 'Power Generation Equipment',
        manufacturer: 'Caterpillar Inc.',
        modelNumber: 'C18-ACERT-500KVA',
        yearOfManufacture: '2022',
        countryOfOrigin: 'United States',
        dateOfAcquisition: '2022-09-10',
        acquisitionMethod: 'PURCHASE',
        supplierInfo: 'Mantrac Nigeria Limited',
        purchaseOrderNumber: 'PO/ARMY/2022/0789',
        contractReference: 'CT/GEN/2022/234',
        costValue: '75000000.00',
        currency: 'NGN',
        fundingSource: 'Infrastructure Development Fund',
        weight: '4200kg',
        dimensions: '4800mm x 1800mm x 2400mm',
        powerRequirements: '415V 3-phase output',
        fuelType: 'Diesel',
        maximumRange: '24 hours continuous operation',
        operationalSpecs: '500kVA prime power, automatic transfer switch, remote monitoring capability',
        requiredCertifications: 'ISO 8528 compliance, CE marking, SONCAP certification',
        environmentalConditions: 'Enclosed weatherproof housing, -20°C to +50°C, 90% humidity',
        currentCondition: 'POOR',
        lastConditionCheck: '2024-07-28',
      }
    }),
    prisma.equipment.create({
      data: {
        chasisNumber: 'RADIO2021NAF001',
        equipmentName: 'Harris Falcon III Radio System',
        model: 'AN/PRC-152A',
        equipmentType: 'Communication Equipment',
        equipmentCategory: 'Tactical Radio',
        manufacturer: 'L3Harris Technologies',
        modelNumber: 'AN/PRC-152A-V1',
        yearOfManufacture: '2021',
        countryOfOrigin: 'United States',
        dateOfAcquisition: '2021-03-25',
        acquisitionMethod: 'DONATION',
        supplierInfo: 'US Military Aid Program',
        purchaseOrderNumber: 'USAID/2021/COMM/156',
        contractReference: 'DONATION/USAID/2021/089',
        costValue: '45000.00',
        currency: 'USD',
        fundingSource: 'US Military Assistance Program',
        weight: '1.4kg',
        dimensions: '240mm x 90mm x 50mm',
        powerRequirements: 'BB-2590 Lithium Battery',
        fuelType: 'Electric (Battery)',
        maximumRange: '10km line of sight',
        operationalSpecs: 'Frequency range 30-512MHz, 256-bit AES encryption, GPS integrated',
        requiredCertifications: 'FCC Type Acceptance, MIL-STD-810G environmental standard',
        environmentalConditions: 'Waterproof IPX7, -32°C to +60°C operating range',
        currentCondition: 'FAILED',
        lastConditionCheck: '2024-08-01',
      }
    }),
    prisma.equipment.create({
      data: {
        chasisNumber: 'BOAT2023NAVY001',
        equipmentName: 'Rigid Hull Inflatable Boat',
        model: 'RHIB 9.5m',
        equipmentType: 'Watercraft',
        equipmentCategory: 'Patrol Boat',
        manufacturer: 'Zodiac Milpro',
        modelNumber: 'RHIB-950-MILPRO',
        yearOfManufacture: '2023',
        countryOfOrigin: 'France',
        dateOfAcquisition: '2023-12-08',
        acquisitionMethod: 'TRANSFER',
        supplierInfo: 'Inter-Service Transfer from Coast Guard',
        purchaseOrderNumber: 'TRANSFER/2023/NAVY/445',
        contractReference: 'TRANSFER/CG-NAVY/2023/012',
        costValue: '0.00',
        currency: 'NGN',
        fundingSource: 'Inter-Service Transfer',
        weight: '1800kg',
        dimensions: '9500mm x 3200mm x 1400mm',
        powerRequirements: '12V Marine Electrical System',
        fuelType: 'Petrol',
        maximumRange: '300 nautical miles',
        operationalSpecs: 'Twin outboard engines, radar system, GPS navigation, 12-person capacity',
        requiredCertifications: 'IMO SOLAS compliance, MCA approval',
        environmentalConditions: 'Salt water operations, sea state 4, -10°C to +40°C',
        currentCondition: 'NOT_APPLICABLE',
        lastConditionCheck: '2024-08-07',
      }
    }),
  ]);

  // 3. Create Operators
  console.log('👨‍💼 Creating operators...');
  const operators = await Promise.all([
    prisma.operator.create({
      data: {
        email: 'driver1@military.gov.ng',
        firstName: 'Sergeant',
        lastName: 'Adebayo',
        serviceNumber: 'ARMY/2020/445566',
        rank: 'Sergeant',
        branch: 'Nigerian Army',
        position: 'Vehicle Operator Class 1',
        identificationType: 'Military ID',
        identificationId: 'MIL/ARMY/445566',
        officialEmailAddress: 'adebayo.s@army.mil.ng',
        phoneNumber: '+2348123456789',
        alternatePhoneNumber1: '+2347012345678',
        alternatePhoneNumber2: '+2348098765432',
        equipmentChasisNumber: 'HILUX2024NAF001',
      }
    }),
    prisma.operator.create({
      data: {
        email: 'operator2@military.gov.ng',
        firstName: 'Corporal',
        lastName: 'Okafor',
        serviceNumber: 'ARMY/2021/778899',
        rank: 'Corporal',
        branch: 'Nigerian Army',
        position: 'Heavy Vehicle Operator',
        identificationType: 'National ID',
        identificationId: '12345678901',
        officialEmailAddress: 'okafor.c@army.mil.ng',
        phoneNumber: '+2348087654321',
        alternatePhoneNumber1: '+2347098765432',
        equipmentChasisNumber: 'DEFENDER2024ARMY001',
      }
    }),
    prisma.operator.create({
      data: {
        email: 'naval.operator@military.gov.ng',
        firstName: 'Petty Officer',
        lastName: 'Emeka',
        serviceNumber: 'NAVY/2022/556677',
        rank: 'Petty Officer 1st Class',
        branch: 'Nigerian Navy',
        position: 'Boat Operator',
        identificationType: 'Military ID',
        identificationId: 'MIL/NAVY/556677',
        officialEmailAddress: 'emeka.po@navy.mil.ng',
        phoneNumber: '+2348076543210',
        alternatePhoneNumber1: '+2347065432109',
        alternatePhoneNumber2: '+2348054321098',
        equipmentChasisNumber: 'BOAT2023NAVY001',
      }
    }),
    prisma.operator.create({
      data: {
        email: 'technician1@military.gov.ng',
        firstName: 'Flight Sergeant',
        lastName: 'Bello',
        serviceNumber: 'NAF/2019/889900',
        rank: 'Flight Sergeant',
        branch: 'Nigerian Air Force',
        position: 'Communications Technician',
        identificationType: 'Military ID',
        identificationId: 'MIL/NAF/889900',
        officialEmailAddress: 'bello.fs@airforce.mil.ng',
        phoneNumber: '+2348043210987',
        alternatePhoneNumber1: '+2347032109876',
        equipmentChasisNumber: 'RADIO2021NAF001',
      }
    }),
  ]);

  // 4. Create Equipment Ownership records
  console.log('📋 Creating equipment ownerships...');
  const ownerships = await Promise.all([
    prisma.equipmentOwnership.create({
      data: {
        equipmentChasisNumber: 'HILUX2024NAF001',
        operatorId: operators[0].id,
        startDate: new Date('2024-06-20'),
        isCurrent: true,
        primaryDuties: 'Base patrol operations, personnel transport, emergency response',
        driverLicenseId: 'DL/NG/2020/123456',
        coFirstName: 'Major',
        coLastName: 'Adamu',
        coEmail: 'major.adamu@army.mil.ng',
        coPhoneNumber: '+2348011223344',
        conditionAtAssignment: 'EXCELLENT',
        notes: 'Operator completed advanced driving course and vehicle familiarization training',
      }
    }),
    prisma.equipmentOwnership.create({
      data: {
        equipmentChasisNumber: 'DEFENDER2024ARMY001',
        operatorId: operators[1].id,
        startDate: new Date('2024-07-25'),
        isCurrent: true,
        primaryDuties: 'Off-road patrol, special operations support, convoy escort',
        driverLicenseId: 'DL/NG/2021/789012',
        coFirstName: 'Lieutenant Colonel',
        coLastName: 'Ibrahim',
        coEmail: 'ltcol.ibrahim@army.mil.ng',
        coPhoneNumber: '+2348022334455',
        conditionAtAssignment: 'GOOD',
        notes: 'Vehicle assigned for special operations unit, operator certified for tactical driving',
      }
    }),
    prisma.equipmentOwnership.create({
      data: {
        equipmentChasisNumber: 'ISUZU2023NAVY001',
        operatorId: operators[1].id, // Same operator for multiple equipment
        startDate: new Date('2023-11-20'),
        endDate: new Date('2024-05-15'),
        isCurrent: false,
        primaryDuties: 'Cargo transport, equipment movement, base logistics support',
        driverLicenseId: 'DL/NG/2021/789012',
        coFirstName: 'Commander',
        coLastName: 'Yakubu',
        coEmail: 'commander.yakubu@navy.mil.ng',
        coPhoneNumber: '+2348033445566',
        conditionAtAssignment: 'GOOD',
        notes: 'Previous assignment completed, vehicle transferred to maintenance pool',
      }
    }),
    prisma.equipmentOwnership.create({
      data: {
        equipmentChasisNumber: 'BOAT2023NAVY001',
        operatorId: operators[2].id,
        startDate: new Date('2023-12-10'),
        isCurrent: true,
        primaryDuties: 'Maritime patrol, search and rescue operations, port security',
        driverLicenseId: 'DL/MARINE/2022/345678',
        coFirstName: 'Lieutenant Commander',
        coLastName: 'Tunde',
        coEmail: 'ltcdr.tunde@navy.mil.ng',
        coPhoneNumber: '+2348044556677',
        conditionAtAssignment: 'FAIR',
        notes: 'Boat operator certified for maritime operations and emergency response',
      }
    }),
    prisma.equipmentOwnership.create({
      data: {
        equipmentChasisNumber: 'RADIO2021NAF001',
        operatorId: operators[3].id,
        startDate: new Date('2021-04-01'),
        isCurrent: true,
        primaryDuties: 'Communication support, field operations, maintenance',
        driverLicenseId: null, // Not applicable for radio equipment
        coFirstName: 'Squadron Leader',
        coLastName: 'Ahmed',
        coEmail: 'sqnldr.ahmed@airforce.mil.ng',
        coPhoneNumber: '+2348055667788',
        conditionAtAssignment: 'EXCELLENT',
        notes: 'Technician certified for tactical communications equipment operation and maintenance',
      }
    }),
  ]);

  // 5. Create Equipment Condition Records
  console.log('📊 Creating equipment condition records...');
  const conditions = await Promise.all([
    // Hilux conditions over time
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'HILUX2024NAF001',
        condition: 'EXCELLENT',
        date: new Date('2024-06-20'),
        notes: 'Initial condition assessment at delivery - brand new vehicle',
        recordedById: users[1].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'HILUX2024NAF001',
        condition: 'EXCELLENT',
        date: new Date('2024-07-15'),
        notes: 'Monthly inspection - all systems operational, minor dust cleaning required',
        recordedById: users[4].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'HILUX2024NAF001',
        condition: 'GOOD',
        date: new Date('2024-08-10'),
        notes: 'Quarterly inspection - minor paint scratches on rear bumper, tire wear within acceptable limits',
        recordedById: users[1].id,
      }
    }),
    
    // Defender conditions
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'DEFENDER2024ARMY001',
        condition: 'EXCELLENT',
        date: new Date('2024-07-25'),
        notes: 'Initial assignment inspection - vehicle in pristine condition',
        recordedById: users[2].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'DEFENDER2024ARMY001',
        condition: 'GOOD',
        date: new Date('2024-08-12'),
        notes: 'Post-operation inspection - minor mud accumulation, all systems functional',
        recordedById: users[2].id,
      }
    }),

    // Generator conditions (deteriorating)
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'GENERATOR2022ARMY001',
        condition: 'EXCELLENT',
        date: new Date('2022-09-15'),
        notes: 'Initial commissioning - all tests passed, full operational capacity',
        recordedById: users[2].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'GENERATOR2022ARMY001',
        condition: 'GOOD',
        date: new Date('2023-03-10'),
        notes: '6-month service - oil changed, filters replaced, minor repairs completed',
        recordedById: users[2].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'GENERATOR2022ARMY001',
        condition: 'FAIR',
        date: new Date('2023-12-20'),
        notes: 'Annual service - fuel system issues detected, coolant leak repaired',
        recordedById: users[2].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'GENERATOR2022ARMY001',
        condition: 'POOR',
        date: new Date('2024-07-28'),
        notes: 'Emergency inspection - engine overheating, requires major overhaul',
        recordedById: users[2].id,
      }
    }),

    // Radio equipment (failed)
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'RADIO2021NAF001',
        condition: 'EXCELLENT',
        date: new Date('2021-04-01'),
        notes: 'Initial deployment - all communication tests passed',
        recordedById: users[1].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'RADIO2021NAF001',
        condition: 'GOOD',
        date: new Date('2022-08-15'),
        notes: 'Annual calibration completed, some button wear noted',
        recordedById: users[4].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'RADIO2021NAF001',
        condition: 'FAIR',
        date: new Date('2023-11-20'),
        notes: 'Display screen showing intermittent issues, audio quality degraded',
        recordedById: users[4].id,
      }
    }),
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'RADIO2021NAF001',
        condition: 'FAILED',
        date: new Date('2024-08-01'),
        notes: 'Complete system failure - no power, suspected circuit board damage from water ingress',
        recordedById: users[4].id,
      }
    }),

    // Boat conditions
    prisma.equipmentCondition.create({
      data: {
        equipmentChasisNumber: 'BOAT2023NAVY001',
        condition: 'NOT_APPLICABLE',
        date: new Date('2024-08-07'),
        notes: 'Currently in dry dock for scheduled maintenance - condition assessment suspended',
        recordedById: users[3].id,
      }
    }),
  ]);

  // 6. Create Inspections
  console.log('🔍 Creating inspections...');
  const inspections = await Promise.all([
    prisma.inspection.create({
      data: {
        equipmentId: equipmentList[0].id, // Hilux
        inspectorId: users[4].id,
        datePerformed: new Date('2024-08-10T09:00:00Z'),
        nextDueDate: new Date('2024-11-10T09:00:00Z'),
        overallNotes: 'Comprehensive quarterly inspection completed. Vehicle in good operational condition with minor cosmetic issues noted.',
      }
    }),
    prisma.inspection.create({
      data: {
        equipmentId: equipmentList[1].id, // Defender
        inspectorId: users[2].id,
        datePerformed: new Date('2024-08-12T14:30:00Z'),
        nextDueDate: new Date('2024-09-12T14:30:00Z'),
        overallNotes: 'Monthly inspection following field operations. All critical systems operational, minor cleaning required.',
      }
    }),
    prisma.inspection.create({
      data: {
        equipmentId: equipmentList[3].id, // Generator
        inspectorId: users[2].id,
        datePerformed: new Date('2024-07-28T08:00:00Z'),
        nextDueDate: new Date('2024-08-28T08:00:00Z'),
        overallNotes: 'Emergency inspection due to operational failures. Major maintenance required before return to service.',
      }
    }),
  ]);

  // 7. Create Detailed Inspection Records
  console.log('📝 Creating detailed inspection records...');

  // Hilux Inspection Details
  await Promise.all([
    // Exterior Inspections
    prisma.exteriorInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Windshield',
        condition: 'EXCELLENT',
        notes: 'Clear visibility, no cracks or chips detected',
      }
    }),
    prisma.exteriorInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Headlights',
        condition: 'EXCELLENT',
        notes: 'Both headlights functioning properly, beam alignment correct',
      }
    }),
    prisma.exteriorInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Tail Lights',
        condition: 'GOOD',
        notes: 'All lights operational, right brake light slightly dimmer than left',
      }
    }),

    // Interior Inspections
    prisma.interiorInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Dashboard',
        condition: 'EXCELLENT',
        notes: 'All gauges and warning lights functioning correctly',
      }
    }),
    prisma.interiorInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Seats',
        condition: 'GOOD',
        notes: 'Driver seat showing minor wear, passenger seats in excellent condition',
      }
    }),
    prisma.interiorInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Safety Equipment',
        condition: 'EXCELLENT',
        notes: 'First aid kit, fire extinguisher, and emergency tools all present and in date',
      }
    }),

    // Mechanical Inspections
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Engine',
        condition: 'GOOD',
        notes: 'Engine running smoothly, oil change due in 2000km. Minor oil seepage from valve cover',
      }
    }),
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Brakes',
        condition: 'EXCELLENT',
        notes: 'Brake pads 80% remaining, brake fluid levels normal, no squealing detected',
      }
    }),
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Transmission',
        condition: 'EXCELLENT',
        notes: 'Smooth shifting, fluid levels normal, no slippage detected',
      }
    }),
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Suspension',
        condition: 'GOOD',
        notes: 'No unusual noises, minor wear on front shock absorbers',
      }
    }),

    // Functional Inspections
    prisma.functionalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Air Conditioning',
        condition: 'FAIR',
        notes: 'AC cooling but not optimal, refrigerant may need topping up',
      }
    }),
    prisma.functionalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Radio System',
        condition: 'EXCELLENT',
        notes: 'Communication system clear, all channels accessible',
      }
    }),
    prisma.functionalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'GPS Navigation',
        condition: 'GOOD',
        notes: 'GPS functioning, maps updated, satellite reception good',
      }
    }),

    // Document Legal Inspections
    prisma.documentLegalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Vehicle Registration',
        condition: 'EXCELLENT',
        notes: 'Registration valid until 2025-12-31, all paperwork in order',
      }
    }),
    prisma.documentLegalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Insurance Certificate',
        condition: 'EXCELLENT',
        notes: 'Comprehensive insurance valid, premium paid up to date',
      }
    }),
    prisma.documentLegalInspection.create({
      data: {
        inspectionId: inspections[0].id,
        itemName: 'Road Worthiness Certificate',
        condition: 'GOOD',
        notes: 'Certificate valid for 6 more months, renewal due February 2025',
      }
    }),

    // Defender Inspection Details
    // Exterior
    prisma.exteriorInspection.create({
      data: {
        inspectionId: inspections[1].id,
        itemName: 'Body Armor Plating',
        condition: 'EXCELLENT',
        notes: 'No damage to protective plating, all mounting points secure',
      }
    }),
    prisma.exteriorInspection.create({
      data: {
        inspectionId: inspections[1].id,
        itemName: 'Mud Guards',
        condition: 'FAIR',
        notes: 'Heavy mud accumulation from recent operations, cleaning required',
      }
    }),

    // Interior
    prisma.interiorInspection.create({
      data: {
        inspectionId: inspections[1].id,
        itemName: 'Tactical Equipment Mounts',
        condition: 'EXCELLENT',
        notes: 'All weapon mounts and tactical gear brackets secure',
      }
    }),

    // Mechanical
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[1].id,
        itemName: 'Terrain Response System',
        condition: 'EXCELLENT',
        notes: 'All terrain modes tested and functioning correctly',
      }
    }),
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[1].id,
        itemName: 'Winch System',
        condition: 'GOOD',
        notes: 'Winch operational, cable shows minor fraying, replacement recommended',
      }
    }),

    // Functional
    prisma.functionalInspection.create({
      data: {
        inspectionId: inspections[1].id,
        itemName: 'Communications Array',
        condition: 'EXCELLENT',
        notes: 'Military radio and satellite communication systems fully operational',
      }
    }),

    // Generator Inspection Details (Poor condition)
    // Mechanical
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[2].id,
        itemName: 'Engine Block',
        condition: 'POOR',
        notes: 'Severe overheating detected, cylinder head gasket failure suspected',
      }
    }),
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[2].id,
        itemName: 'Cooling System',
        condition: 'FAILED',
        notes: 'Radiator cracked, coolant pump bearing failure, immediate replacement required',
      }
    }),
    prisma.mechanicalInspection.create({
      data: {
        inspectionId: inspections[2].id,
        itemName: 'Fuel System',
        condition: 'POOR',
        notes: 'Fuel filters clogged, water contamination in fuel tank detected',
      }
    }),

    // Functional
    prisma.functionalInspection.create({
      data: {
        inspectionId: inspections[2].id,
        itemName: 'Power Output',
        condition: 'FAILED',
        notes: 'Unable to maintain rated output, voltage fluctuations severe',
      }
    }),
    prisma.functionalInspection.create({
      data: {
        inspectionId: inspections[2].id,
        itemName: 'Control Panel',
        condition: 'FAIR',
        notes: 'Some gauges not reading correctly, emergency stop functional',
      }
    }),

    // Exterior
    prisma.exteriorInspection.create({
      data: {
        inspectionId: inspections[2].id,
        itemName: 'Enclosure',
        condition: 'GOOD',
        notes: 'Weather housing intact, ventilation grilles clear',
      }
    }),
  ]);

  // 8. Create Documents with Google Drive URLs
  console.log('📄 Creating documents...');
  const documents = await Promise.all([
    // Equipment Documents
    prisma.document.create({
      data: {
        url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
        description: 'Toyota Hilux Owner Manual',
        fileName: 'hilux_owners_manual_2024.pdf',
        fileSize: 15728640,
        mimeType: 'application/pdf',
        equipmentId: equipmentList[0].id,
        metadata: {
          documentType: 'manual',
          language: 'English',
          version: '2024.1',
          pages: 245
        }
      }
    }),
    prisma.document.create({
      data: {
        url: 'https://docs.google.com/document/d/1234567890abcdefghijklmnop/edit',
        description: 'Vehicle Registration Certificate - Hilux',
        fileName: 'hilux_registration_cert.pdf',
        fileSize: 1048576,
        mimeType: 'application/pdf',
        equipmentId: equipmentList[0].id,
        metadata: {
          documentType: 'registration',
          registrationNumber: 'NAF-001-2024',
          validUntil: '2025-12-31',
          issuingAuthority: 'Federal Road Safety Corps'
        }
      }
    }),
    prisma.document.create({
      data: {
        url: 'https://drive.google.com/file/d/0987654321zyxwvutsrqponmlkjihgfedcba/view',
        description: 'Insurance Certificate - Hilux',
        fileName: 'hilux_insurance_2024.pdf',
        fileSize: 524288,
        mimeType: 'application/pdf',
        equipmentId: equipmentList[0].id,
        metadata: {
          documentType: 'insurance',
          policyNumber: 'NICON/VEH/2024/001234',
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          insurer: 'NICON Insurance Corporation'
        }
      }
    }),
    prisma.document.create({
      data: {
        url: 'https://lh3.googleusercontent.com/d/1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        description: 'Equipment Photo - Hilux Front View',
        fileName: 'hilux_front_view_aug_2024.jpg',
        fileSize: 3145728,
        mimeType: 'image/jpeg',
        equipmentId: equipmentList[0].id,
        metadata: {
          photoType: 'equipment',
          view: 'front',
          captureDate: '2024-08-10',
          resolution: '4032x3024',
          photographer: 'Inspector Sarah Okafor'
        }
      }
    }),
    prisma.document.create({
      data: {
        url: 'https://drive.google.com/file/d/abcdef1234567890ghijklmnopqrstuvwxyz/view',
        description: 'Land Rover Defender Service Manual',
        fileName: 'defender_service_manual_2024.pdf',
        fileSize: 25165824,
        mimeType: 'application/pdf',
        equipmentId: equipmentList[1].id,
        metadata: {
          documentType: 'service_manual',
          language: 'English',
          modelYear: '2024',
          pages: 892
        }
      }
    }),

    // Operator Documents
    prisma.document.create({
      data: {
        url: 'https://docs.google.com/document/d/operator1_license_scan/edit',
        description: 'Driver License - Sergeant Adebayo',
        fileName: 'adebayo_driver_license.jpg',
        fileSize: 2097152,
        mimeType: 'image/jpeg',
        operatorId: operators[0].id,
        metadata: {
          documentType: 'license',
          licenseNumber: 'DL/NG/2020/123456',
          licenseClass: 'C',
          expiryDate: '2025-06-15',
          issuingState: 'Lagos'
        }
      }
    }),
    prisma.document.create({
      data: {
        url: 'https://drive.google.com/file/d/operator1_training_cert/view',
        description: 'Advanced Driving Course Certificate - Sergeant Adebayo',
        fileName: 'adebayo_advanced_driving_cert.pdf',
        fileSize: 1572864,
        mimeType: 'application/pdf',
        operatorId: operators[0].id,
        metadata: {
          documentType: 'training_certificate',
          courseName: 'Military Advanced Driving Course',
          completionDate: '2024-05-20',
          validityPeriod: '3 years',
          issuingInstitution: 'Nigerian Army Training School'
        }
      }
    }),

    // Inspection Documents
    prisma.document.create({
      data: {
        url: 'https://docs.google.com/spreadsheets/d/inspection_checklist_hilux/edit',
        description: 'Inspection Checklist - Hilux August 2024',
        fileName: 'hilux_inspection_checklist_aug_2024.xlsx',
        fileSize: 1048576,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        inspectionId: inspections[0].id,
        metadata: {
          documentType: 'inspection_checklist',
          inspectionDate: '2024-08-10',
          inspector: 'Flight Lieutenant Ibrahim Yusuf',
          checklistVersion: 'v2.3'
        }
      }
    }),
    prisma.document.create({
      data: {
        url: 'https://drive.google.com/file/d/inspection_photos_hilux_batch1/view',
        description: 'Inspection Photos - Hilux Damage Areas',
        fileName: 'hilux_damage_photos_aug_2024.zip',
        fileSize: 15728640,
        mimeType: 'application/zip',
        inspectionId: inspections[0].id,
        metadata: {
          documentType: 'inspection_photos',
          photoCount: 24,
          captureDate: '2024-08-10',
          photographer: 'Flight Lieutenant Ibrahim Yusuf'
        }
      }
    }),

    // Generator Maintenance Documents
    prisma.document.create({
      data: {
        url: 'https://docs.google.com/document/d/generator_failure_report/edit',
        description: 'Generator Failure Analysis Report',
        fileName: 'generator_failure_analysis_july_2024.pdf',
        fileSize: 2621440,
        mimeType: 'application/pdf',
        equipmentId: equipmentList[3].id,
        metadata: {
          documentType: 'failure_report',
          reportDate: '2024-07-28',
          technician: 'Warrant Officer Mechanical',
          severity: 'Critical',
          estimatedRepairCost: 'NGN 2,500,000'
        }
      }
    }),

    // Ownership Documents
    prisma.document.create({
      data: {
        url: 'https://drive.google.com/file/d/ownership_transfer_form_001/view',
        description: 'Equipment Assignment Form - Hilux to Sergeant Adebayo',
        fileName: 'equipment_assignment_form_hilux_001.pdf',
        fileSize: 786432,
        mimeType: 'application/pdf',
        ownershipId: ownerships[0].id,
        metadata: {
          documentType: 'assignment_form',
          assignmentDate: '2024-06-20',
          authorizingOfficer: 'Major Adamu',
          formNumber: 'EA/2024/NAF/001'
        }
      }
    }),

    // Condition Record Documents
    prisma.document.create({
      data: {
        url: 'https://lh3.googleusercontent.com/d/condition_photos_before_after/view',
        description: 'Before/After Condition Photos - Radio Equipment',
        fileName: 'radio_condition_photos_aug_2024.jpg',
        fileSize: 4194304,
        mimeType: 'image/jpeg',
        conditionId: conditions[conditions.length - 4].id, // Radio failure condition
        metadata: {
          photoType: 'condition_documentation',
          damageType: 'water_damage',
          captureDate: '2024-08-01',
          photographer: 'Flight Sergeant Bello'
        }
      }
    }),
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:
  - ${users.length} users (all roles and statuses)
  - ${equipmentList.length} equipment items (all conditions)
  - ${operators.length} operators
  - ${ownerships.length} ownership records
  - ${conditions.length} condition records
  - ${inspections.length} inspections with detailed sub-inspections
  - ${documents.length} documents with Google Drive URLs
  `);


}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  
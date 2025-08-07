import { Request, Response } from 'express';
import { prisma } from '../server';
import { BadRequestError, notFoundError } from '../httpClass/exceptions';


// Get all equipment with advanced filtering
export const getAllEquipment = async (req: Request, res: Response) => {
    
    const equipment = await prisma.equipment.findMany({
      include: {
        registeredBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rank: true,
            unit: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
        warrantyInfo: true,
        assignments: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                rank: true,
              },
            },
          },
        },
        _count: {
          select: {
            maintenanceRecords: true,
            inspectionRecords: true,
            transferHistory: true,
            documents: true,
          },
        },
      },
    });


    res.status(200).json({
      success: true,
      data: equipment,
    });
}

// Get equipment by ID with full details
export const getEquipmentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { includeHistory = 'false' } = req.query;

    const includeOptions: any = {
      registeredBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rank: true,
          unit: true,
          email: true,
        },
      },
      approvedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rank: true,
        },
      },
      authorizedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rank: true,
        },
      },
      warrantyInfo: true,
      assignments: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              rank: true,
              email: true,
            },
          },
        },
        orderBy: { startDate: 'desc' },
      },
      documents: {
        select: {
          id: true,
          fileName: true,
          originalName: true,
          category: true,
          fileSize: true,
          description: true,
          createdAt: true,
        },
      },
    };

    // Include history if requested
    if (includeHistory === 'true') {
      includeOptions.maintenanceRecords = {
        include: {
          technician: {
            select: {
              firstName: true,
              lastName: true,
              rank: true,
            },
          },
        },
        orderBy: { scheduledDate: 'desc' },
        take: 10,
      };
      includeOptions.inspectionRecords = {
        include: {
          inspector: {
            select: {
              firstName: true,
              lastName: true,
              rank: true,
            },
          },
        },
        orderBy: { inspectionDate: 'desc' },
        take: 10,
      };
      includeOptions.transferHistory = {
        include: {
          initiatedBy: {
            select: {
              firstName: true,
              lastName: true,
              rank: true,
            },
          },
          approvedBy: {
            select: {
              firstName: true,
              lastName: true,
              rank: true,
            },
          },
        },
        orderBy: { transferDate: 'desc' },
      };
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: includeOptions,
    });

    if (!equipment) throw new notFoundError('Equipment not found')
     
    res.status(200).json({
      success: true,
      data: equipment,
    });

};

// Register new equipment
export const createEquipment = async (req: Request, res: Response) => {
    const {
      // Section A: Equipment Identification
      chasisNumber,
      equipmentName,
      model,
      equipmentType,
      equipmentCategory,
      manufacturer,
      modelNumber,
      yearOfManufacture,
      countryOfOrigin,
      
      // Section B: Acquisition Details
      dateOfAcquisition,
      acquisitionMethod,
      supplierInfo,
      purchaseOrderNumber,
      contractReference,
      costValue,
      currency = 'NGN',
      fundingSource,
      
      // Section C: Technical Specifications
      weight,
      length,
      width,
      height,
      powerRequirements,
      fuelType,
      maximumRange,
      operationalSpecs,
      requiredCertifications,
      environmentalConditions,
      
      // Section D: Assignment & Location
      currentLocation,
      currentBase,
      assignedUnit,
      commandingOfficer,
      securityClassification = 'UNCLASSIFIED',
      
      // Section E: Operational Status
      currentStatus = 'ACTIVE',
      operationalHours,
      mileage,
      lastInspectionDate,
      nextMaintenanceDate,
      availabilityPercentage,
      
      // Section G: Documentation & Compliance
      hasOperatingManual = false,
      trainingRequirements,
      safetyNotes,
      insuranceInfo,
      
      // Section J: Additional Information
      specialHandling,
      environmentalNotes,
      relatedEquipment,
      backupSystems,
      technicalSupport,
      notes,
      
      // Section L: Registration info
      registeredById,
      
      // Warranty Information
      warrantyInfo,
    } = req.body;


    const existingEquipment = await prisma.equipment.findUnique({
      where: { chasisNumber },
    });

    if (existingEquipment) throw new BadRequestError('Equipment with this serial number already exists')

    // Create equipment with warranty info if provided
    const equipment = await prisma.equipment.create({
      data: {
        chasisNumber,
        equipmentName,
        model,
        equipmentType,
        equipmentCategory,
        manufacturer,
        modelNumber,
        yearOfManufacture,
        countryOfOrigin,
        dateOfAcquisition: new Date(dateOfAcquisition),
        acquisitionMethod,
        supplierInfo,
        purchaseOrderNumber,
        contractReference,
        costValue,
        currency,
        fundingSource,
        weight,
        length,
        width,
        height,
        powerRequirements,
        fuelType,
        maximumRange,
        operationalSpecs,
        requiredCertifications,
        environmentalConditions,
        currentLocation,
        currentBase,
        assignedUnit,
        commandingOfficer,
        securityClassification,
        currentStatus,
        operationalHours,
        mileage,
        lastInspectionDate: lastInspectionDate ? new Date(lastInspectionDate) : null,
        nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
        availabilityPercentage,
        hasOperatingManual,
        trainingRequirements,
        safetyNotes,
        insuranceInfo,
        specialHandling,
        environmentalNotes,
        relatedEquipment,
        backupSystems,
        technicalSupport,
        notes,
        registeredById,
        ...(warrantyInfo && {
          warrantyInfo: {
            create: {
              startDate: new Date(warrantyInfo.startDate),
              endDate: new Date(warrantyInfo.endDate),
              coverageDetails: warrantyInfo.coverageDetails,
              warrantyProvider: warrantyInfo.warrantyProvider,
              contactInfo: warrantyInfo.contactInfo,
            },
          },
        }),
      },
      include: {
        registeredBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
            unit: true,
          },
        },
        warrantyInfo: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Equipment registered successfully',
      data: equipment,
    });
 
  
};

export const updateEquipment = async (req: Request, res: Response) => {
// check equipment function
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.registrationDate;

    // Handle date fields
    if (updateData.dateOfAcquisition) {
      updateData.dateOfAcquisition = new Date(updateData.dateOfAcquisition);
    }
    if (updateData.lastInspectionDate) {
      updateData.lastInspectionDate = new Date(updateData.lastInspectionDate);
    }
    if (updateData.nextMaintenanceDate) {
      updateData.nextMaintenanceDate = new Date(updateData.nextMaintenanceDate);
    }

    const equipment = await prisma.equipment.update({
      where: { id },
      data: updateData,
      include: {
        registeredBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
        approvedBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Equipment updated successfully',
      data: equipment,
    });
}

export const approveEquipment = async (req: Request, res: Response) => {
  //check equipment
    const { id } = req.params;
    const { approvedById, referenceNumber } = req.body;

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        approvedById,
        approvalDate: new Date(),
        referenceNumber,
      },
      include: {
        registeredBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
        approvedBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Equipment approved successfully',
      data: equipment,
    });
 
};


export const authorizeEquipment = async (req: Request, res: Response) => {
  //check equipment
    const { id } = req.params;
    const { authorizedById } = req.body;

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        authorizedById,
        authorizationDate: new Date(),
      },
      include: {
        registeredBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
        approvedBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
        authorizedBy: {
          select: {
            firstName: true,
            lastName: true,
            rank: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Equipment authorized successfully',
      data: equipment,
    });
};

// Update equipment status
export const updateEquipmentStatus = async (req: Request, res: Response) => {
  //check equipment
  
    const { id } = req.params;
    const { currentStatus, notes } = req.body;

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        currentStatus,
        ...(notes && { notes }),
      },
      select: {
        id: true,
        chasisNumber: true,
        equipmentName: true,
        currentStatus: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Equipment status updated successfully',
      data: equipment,
    });
};

// Soft delete equipment (mark as inactive)
export const deleteEquipment = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Check if equipment has active assignments or pending maintenance
    const equipmentWithRelations = await prisma.equipment.findUnique({
      where: { id },
      include: {
        assignments: {
          where: { isActive: true },
        },
        maintenanceRecords: {
          where: {
            status: {
              in: ['SCHEDULED', 'IN_PROGRESS'],
            },
          },
        },
      },
    });

    if (!equipmentWithRelations) throw new BadRequestError('Equipment not found')
    
    if (equipmentWithRelations.assignments.length > 0) throw new BadRequestError('Cannot delete equipment with active assignments')
     

    if (equipmentWithRelations.maintenanceRecords.length > 0) throw new BadRequestError('Cannot delete equipment with pending maintenance')

    await prisma.equipment.update({
      where: { id },
      data: {
        isActive: false,
        currentStatus: 'DECOMMISSIONED',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Equipment decommissioned successfully',
    });
};

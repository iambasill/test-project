# Equipment API Documentation

## Base URL

```
/api/equipment
```

## Endpoints

### 1. Get All Equipment

**GET** `/api/equipment`

Returns a list of all equipment with current ownership and recent condition data.

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "uuid",
      "chasisNumber": "CH123456789",
      "equipmentName": "Military Vehicle",
      "model": "Model X",
      "equipmentType": "Vehicle",
      "equipmentCategory": "Transport",
      "manufacturer": "ABC Motors",
      "modelNumber": "MX-2024",
      "yearOfManufacture": 2024,
      "countryOfOrigin": "Nigeria",
      "dateOfAcquisition": "2024-01-15T00:00:00.000Z",
      "acquisitionMethod": "PURCHASE",
      "currentCondition": "EXCELLENT",
      "ownerships": [...],
      "conditionHistory": [...],
      "inspections": [...],
      "documents": [...]
    }
  ]
}
```

### 2. Get Equipment by ID

**GET** `/api/equipment/:id`

Returns detailed information about a specific equipment item.

**Parameters:**

- `id` (string, required): Equipment UUID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "chasisNumber": "CH123456789",
    "equipmentName": "Military Vehicle",
    // ... all equipment fields
    "ownerships": [...],
    "conditionHistory": [...],
    "inspections": [...],
    "documents": [...],
    "operators": [...]
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Equipment not found"
}
```

### 3. Create Equipment

**POST** `/api/equipment`

Creates a new equipment record.

**Request Body:**

```json
{
  "chasisNumber": "CH123456789",
  "equipmentName": "Military Vehicle",
  "model": "Model X",
  "equipmentType": "Vehicle",
  "equipmentCategory": "Transport",
  "manufacturer": "ABC Motors",
  "modelNumber": "MX-2024",
  "yearOfManufacture": 2024,
  "countryOfOrigin": "Nigeria",
  "dateOfAcquisition": "2024-01-15T00:00:00.000Z",
  "acquisitionMethod": "PURCHASE",
  "supplierInfo": "ABC Suppliers Ltd",
  "purchaseOrderNumber": "PO-2024-001",
  "contractReference": "CT-2024-001",
  "costValue": 50000.0,
  "currency": "NGN",
  "fundingSource": "Defense Budget",
  "weight": 2500.5,
  "dimensions": "5m x 2m x 2.5m",
  "powerRequirements": "Diesel Engine",
  "fuelType": "Diesel",
  "maximumRange": "500km",
  "operationalSpecs": "Off-road capable military vehicle",
  "requiredCertifications": "Military Standard Certification",
  "environmentalConditions": "All weather operations"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Equipment created successfully",
  "data": {
    "id": "uuid",
    "chasisNumber": "CH123456789"
    // ... created equipment data
  }
}
```

### 4. Update Equipment

**PUT** `/api/equipment/:id`

Updates an existing equipment record.

**Parameters:**

- `id` (string, required): Equipment UUID

**Request Body:** (same as create, all fields optional)

**Response:**

```json
{
  "success": true,
  "message": "Equipment updated successfully",
  "data": {
    // ... updated equipment data
  }
}
```

### 5. Delete Equipment

**DELETE** `/api/equipment/:id`

Deletes an equipment record.

**Parameters:**

- `id` (string, required): Equipment UUID

**Response:**

```json
{
  "success": true,
  "message": "Equipment deleted successfully"
}
```

### 6. Get Equipment by Chassis Number

**GET** `/api/equipment/chassis/:chasisNumber`

Retrieves equipment by its chassis number.

**Parameters:**

- `chasisNumber` (string, required): Chassis number

**Response:** Same as Get Equipment by ID

### 7. Get Equipment by Type

**GET** `/api/equipment/type/:type`

Retrieves equipment by type or category.

**Parameters:**

- `type` (string, required): Equipment type or category

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    // ... equipment array
  ]
}
```

### 8. Search Equipment

**GET** `/api/equipment/search`

Search equipment with multiple filters.

**Query Parameters:**

- `q` (string, optional): General search query (searches name, model, chassis, manufacturer)
- `manufacturer` (string, optional): Filter by manufacturer
- `type` (string, optional): Filter by equipment type
- `condition` (string, optional): Filter by condition status
- `year` (number, optional): Filter by year of manufacture

**Example:**

```
GET /api/equipment/search?q=vehicle&manufacturer=Toyota&condition=EXCELLENT
```

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    // ... filtered equipment array
  ]
}
```

### 9. Get Equipment Condition History

**GET** `/api/equipment/:id/conditions`

Retrieves the condition history for specific equipment.

**Parameters:**

- `id` (string, required): Equipment UUID

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "condition": "GOOD",
      "date": "2024-08-01T10:00:00.000Z",
      "notes": "Minor wear on exterior paint",
      "recordedBy": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "documents": [...]
    }
  ]
}
```

### 10. Update Equipment Condition

**POST** `/api/equipment/:id/conditions`

Creates a new condition record and updates equipment's current condition.

**Parameters:**

- `id` (string, required): Equipment UUID

**Request Body:**

```json
{
  "condition": "GOOD",
  "notes": "Regular maintenance completed",
  "recordedById": "user-uuid"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Equipment condition updated successfully",
  "data": {
    "equipment": {
      // ... updated equipment data
    },
    "conditionRecord": {
      // ... new condition record
    }
  }
}
```

### 11. Get Equipment Inspections

**GET** `/api/equipment/:id/inspections`

Retrieves all inspections for specific equipment.

**Parameters:**

- `id` (string, required): Equipment UUID

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "uuid",
      "datePerformed": "2024-08-01T09:00:00.000Z",
      "nextDueDate": "2024-11-01T09:00:00.000Z",
      "overallNotes": "Comprehensive inspection completed",
      "inspector": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com"
      },
      "exteriorInspections": [...],
      "interiorInspections": [...],
      "mechanicalInspections": [...],
      "functionalInspections": [...],
      "documentLegalInspections": [...],
      "documents": [...]
    }
  ]
}
```

### Equipment Model

```json
{
  "id": "string (UUID)",
  "chasisNumber": "string (unique)",
  "equipmentName": "string",
  "model": "string",
  "equipmentType": "string",
  "equipmentCategory": "string (optional)",
  "manufacturer": "string",
  "modelNumber": "string (optional)",
  "yearOfManufacture": "integer",
  "countryOfOrigin": "string",
  "dateOfAcquisition": "datetime",
  "acquisitionMethod": "enum (PURCHASE, LEASE, DONATION, TRANSFER, OTHER)",
  "supplierInfo": "string (optional)",
  "purchaseOrderNumber": "string (optional)",
  "contractReference": "string (optional)",
  "costValue": "decimal (optional)",
  "currency": "string (default: NGN)",
  "fundingSource": "string (optional)",
  "weight": "decimal (optional)",
  "dimensions": "string (optional)",
  "powerRequirements": "string (optional)",
  "fuelType": "string (optional)",
  "maximumRange": "string (optional)",
  "operationalSpecs": "text (optional)",
  "requiredCertifications": "text (optional)",
  "environmentalConditions": "text (optional)",
  "currentCondition": "enum (EXCELLENT, GOOD, FAIR, POOR, FAILED, NOT_APPLICABLE)",
  "lastConditionCheck": "datetime (optional)"
}
```

### Condition Status Enum

- `EXCELLENT`
- `GOOD`
- `FAIR`
- `POOR`
- `FAILED`
- `NOT_APPLICABLE`

### Acquisition Method Enum

- `PURCHASE`
- `LEASE`
- `DONATION`
- `TRANSFER`
- `OTHER`

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

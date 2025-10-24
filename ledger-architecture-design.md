# Ledger System Architecture Design

## Current Issues
- Mixed responsibilities in components
- Confusing route structure
- Missing subLedger management interface
- Incomplete state management

## Recommended Architecture

### 1. Route Structure
```
/ledgers                           → LedgerList (all ledgers)
/ledgers/:ledgerId                 → SubLedgerList (subLedgers for specific ledger)
/ledgers/:ledgerId/:subLedgerId    → LedgerTransactions (transactions for specific subLedger)
```

### 2. Component Hierarchy
```
src/features/ledgers/
├── index.jsx                     → Main ledger list
├── subLedgers/
│   ├── index.jsx                 → SubLedger list for a ledger
│   ├── SubLedgerForm.jsx         → Create/Edit subLedger
│   └── SubLedgerItem.jsx         → Individual subLedger component
└── transactions/
    ├── index.jsx                 → Transaction list for a subLedger
    ├── TransactionForm.jsx       → Create/Edit transaction
    └── TransactionItem.jsx       → Individual transaction component
```

### 3. Navigation Flow
```
Ledgers List
    ↓ (click ledger)
SubLedgers List
    ↓ (click subLedger)
Transactions List
```

### 4. State Management
```javascript
// Redux Store Structure
{
  ledgers: {
    ledgers: [],
    selectedLedger: null,
    loading: false,
    pagination: {}
  },
  subLedgers: {
    subLedgers: [],
    selectedSubLedger: null,
    loading: false,
    pagination: {}
  },
  ledgerTransactions: {
    transactions: [],
    loading: false,
    pagination: {}
  }
}
```

### 5. API Endpoints Structure
```
GET    /api/ledgers                    → Get all ledgers
GET    /api/ledgers/:ledgerId/sub-ledgers → Get subLedgers for a ledger
GET    /api/sub-ledgers/:subLedgerId/transactions → Get transactions for a subLedger
POST   /api/sub-ledgers                → Create subLedger
POST   /api/transactions               → Create transaction
```

### 6. Breadcrumb Navigation
```
Home > Ledgers > [Ledger Name] > [SubLedger Name] > Transactions
```

## Implementation Steps

### Step 1: Create SubLedger Redux Slice
- Create subLedger slice with CRUD operations
- Add selectors for subLedger state
- Add async thunks for API calls

### Step 2: Create SubLedger Components
- SubLedgerList component
- SubLedgerForm component
- SubLedgerItem component

### Step 3: Update Routes
- Add new routes for subLedger management
- Update navigation logic

### Step 4: Update LedgerTransactions
- Separate transaction management from subLedger creation
- Clean up mixed responsibilities

### Step 5: Add Navigation
- Implement breadcrumb navigation
- Add back buttons
- Update sidebar navigation

## Benefits of This Design

1. **Clear Separation of Concerns**: Each component has a single responsibility
2. **Intuitive Navigation**: Logical flow from ledgers → subLedgers → transactions
3. **Scalable**: Easy to add new features to each level
4. **Maintainable**: Clear file structure and component hierarchy
5. **User-Friendly**: Breadcrumb navigation and clear hierarchy


---
id: basics-ex1
title: "01 Basics — Exercise 1: Bank Transactions"
source: "Pandas exercises/01 Basics/Exercise 1 - Bank Transactions/Bank Transactions.pdf"
datafile: "Pandas exercises/01 Basics/Exercise 1 - Bank Transactions/bank_transactions.csv"
topic: "Inspect, select, filter, first look at missing values"
group: "Pandas exercises"
order: 30
setup: |
  import pandas as pd

  pd.set_option("display.width", 200)        # so wide frames print in full
  pd.set_option("display.max_columns", None)

  df = pd.read_csv("bank_transactions.csv")
---

### Q1

**Q.** Load the dataset and display the first 5 and last 5 rows.

**A.**

```python
print(df.head())
print(df.tail())
```

```text
   TxnID        Date  AccountID   Branch TxnType    Amount Channel          Remarks
0   5001  01-07-2025        101   Mumbai  Credit  250000.0    NEFT           Salary
1   5002  01-07-2025        101     Pune   Debit   12000.0     ATM  Cash withdrawal
2   5003  02-07-2025        102    Delhi   Debit    4500.0     UPI     Bill payment
3   5004  02-07-2025        103   Mumbai  Credit  510000.0    RTGS    Sale proceeds
4   5005  03-07-2025        104  Chennai  Credit   15000.0     UPI           Refund
    TxnID        Date  AccountID   Branch TxnType   Amount Channel   Remarks
7    5008  04-07-2025        106    Delhi   Debit   2200.0     UPI  Recharge
8    5009  04-07-2025        101  Chennai  Credit  90000.0    NEFT     Bonus
9    5010  05-07-2025        104   Mumbai   Debit   1500.0     ATM       Fee
10   5011  05-07-2025        107     Pune  Credit  78000.0     UPI  Dividend
11   5012  06-07-2025        108      NaN   Debit   3200.0     ATM   Cash wd
```

### Q2

**Q.** Find the total number of rows and columns, and list all column names.

**A.**

```python
print(df.shape)
print(df.columns.tolist())
```

```text
(12, 8)
['TxnID', 'Date', 'AccountID', 'Branch', 'TxnType', 'Amount', 'Channel', 'Remarks']
```

### Q3

**Q.** Show general info and data types for each column. Identify numeric columns.

**A.**

```python
df.info()
print(df.dtypes)
print(df.select_dtypes(include="number").columns.tolist())
```

```text
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 12 entries, 0 to 11
Data columns (total 8 columns):
 #   Column     Non-Null Count  Dtype  
---  ------     --------------  -----  
 0   TxnID      12 non-null     int64  
 1   Date       12 non-null     object 
 2   AccountID  12 non-null     int64  
 3   Branch     10 non-null     object 
 4   TxnType    12 non-null     object 
 5   Amount     11 non-null     float64
 6   Channel    12 non-null     object 
 7   Remarks    11 non-null     object 
dtypes: float64(1), int64(2), object(5)
memory usage: 896.0+ bytes
TxnID          int64
Date          object
AccountID      int64
Branch        object
TxnType       object
Amount       float64
Channel       object
Remarks       object
dtype: object
['TxnID', 'AccountID', 'Amount']
```

Numeric columns: `TxnID`, `AccountID`, `Amount`. `Amount` is `float64` rather than `int64` only
because it has one missing value. `Date` is read as text, not a date; the file stores
`01-07-2025` — **DD-MM-YYYY**, not the YYYY-MM-DD the PDF claims — so it needs
`pd.to_datetime(df["Date"], dayfirst=True)` before any date work.

### Q4

**Q.** Display descriptive statistics for the numeric columns. Add percentiles at 0.3, 0.7, 0.9.

**A.**

```python
print(df.describe(percentiles=[0.3, 0.7, 0.9]))
```

```text
             TxnID   AccountID        Amount
count    12.000000   12.000000  1.100000e+01
mean   5006.500000  103.666667  2.696727e+05
std       3.605551    2.424621  5.947465e+05
min    5001.000000  101.000000  1.500000e+03
30%    5004.300000  102.000000  4.500000e+03
50%    5006.500000  103.500000  1.500000e+04
70%    5008.700000  104.700000  9.000000e+04
90%    5010.900000  106.900000  5.100000e+05
max    5012.000000  108.000000  2.000000e+06
```

### Q5

**Q.** Show only the Date, Branch, TxnType, and Amount columns.

**A.**

```python
print(df[["Date", "Branch", "TxnType", "Amount"]])
```

```text
          Date   Branch TxnType     Amount
0   01-07-2025   Mumbai  Credit   250000.0
1   01-07-2025     Pune   Debit    12000.0
2   02-07-2025    Delhi   Debit     4500.0
3   02-07-2025   Mumbai  Credit   510000.0
4   03-07-2025  Chennai  Credit    15000.0
5   03-07-2025     Pune   Debit        NaN
6   03-07-2025      NaN  Credit  2000000.0
7   04-07-2025    Delhi   Debit     2200.0
8   04-07-2025  Chennai  Credit    90000.0
9   05-07-2025   Mumbai   Debit     1500.0
10  05-07-2025     Pune  Credit    78000.0
11  06-07-2025      NaN   Debit     3200.0
```

### Q6

**Q.** Filter all Credit transactions with Amount >= 200000.

**A.**

```python
q6 = df[(df["TxnType"] == "Credit") & (df["Amount"] >= 200000)]
print(q6)
print("rows:", q6.shape[0])
```

```text
   TxnID        Date  AccountID  Branch TxnType     Amount Channel        Remarks
0   5001  01-07-2025        101  Mumbai  Credit   250000.0    NEFT         Salary
3   5004  02-07-2025        103  Mumbai  Credit   510000.0    RTGS  Sale proceeds
6   5007  03-07-2025        105     NaN  Credit  2000000.0    NEFT    FD maturity
rows: 3
```

### Q7

**Q.** Filter transactions from Pune branch or where Branch is missing.

**A.**

```python
q7 = df[(df["Branch"] == "Pune") | (df["Branch"].isna())]
print(q7)
print("rows:", q7.shape[0])
```

```text
    TxnID        Date  AccountID Branch TxnType     Amount Channel          Remarks
1    5002  01-07-2025        101   Pune   Debit    12000.0     ATM  Cash withdrawal
5    5006  03-07-2025        102   Pune   Debit        NaN     ATM              NaN
6    5007  03-07-2025        105    NaN  Credit  2000000.0    NEFT      FD maturity
10   5011  05-07-2025        107   Pune  Credit    78000.0     UPI         Dividend
11   5012  06-07-2025        108    NaN   Debit     3200.0     ATM          Cash wd
rows: 5
```

5 rows — 3 Pune plus 2 with no branch. The blanks can only be caught with `.isna()`, because
`NaN == "Pune"` is `False`.

### Q8

**Q.** Count missing values per column.

**A.**

```python
print(df.isna().sum())
```

```text
TxnID        0
Date         0
AccountID    0
Branch       2
TxnType      0
Amount       1
Channel      0
Remarks      1
dtype: int64
```

### Q9

**Q.** Show all transactions where Amount is missing.

**A.**

```python
print(df[df["Amount"].isna()])
```

```text
   TxnID        Date  AccountID Branch TxnType  Amount Channel Remarks
5   5006  03-07-2025        102   Pune   Debit     NaN     ATM     NaN
```

### Q10

**Q.** Create a version without rows having missing Amount and compare shapes with the original.

**A.**

```python
clean = df.dropna(subset=["Amount"])
print("original:", df.shape)
print("cleaned :", clean.shape)
```

```text
original: (12, 8)
cleaned : (11, 8)
```

One row dropped (TxnID 5006); the column count is unchanged.

### Q11

**Q.** Replace missing Amount values with 0 and display the affected rows.

**A.** Capture the mask **before** filling — after the fill there is nothing left to find.

```python
mask = df["Amount"].isna()
df.loc[mask, "Amount"] = 0
print(df.loc[mask])
print("missing Amount now:", df["Amount"].isna().sum())
```

```text
   TxnID        Date  AccountID Branch TxnType  Amount Channel Remarks
5   5006  03-07-2025        102   Pune   Debit     0.0     ATM     NaN
missing Amount now: 0
```

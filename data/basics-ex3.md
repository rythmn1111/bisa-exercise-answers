---
id: basics-ex3
title: "01 Basics — Exercise 3: Portfolio Holdings"
source: "Pandas exercises/01 Basics/Exercise 3 - Portfolio Holdings/Portfolio Holdings.pdf"
datafile: "Pandas exercises/01 Basics/Exercise 3 - Portfolio Holdings/portfolio_holdings.xlsx"
topic: "Two-sheet Excel workbook: inspect, filter, drop, fill"
group: "Pandas exercises"
order: 32
setup: |
  import pandas as pd
  XL = "portfolio_holdings.xlsx"          # sheets: Equity, Debt
---

### Q1

**Q.** Read the Equity sheet and show first few rows, info, and data types.

**A.**

```python
eq = pd.read_excel(XL, sheet_name="Equity")
print(eq.head())
eq.info()
print(eq.dtypes)
```

```text
     Ticker InstrumentName  Quantity   Price Exchange
0      INFY        Infosys     120.0  1700.5      NSE
1       TCS            TCS      80.0  3800.0      NSE
2  HDFCBANK      HDFC Bank     150.0  1650.0      NSE
3  RELIANCE       Reliance      60.0  2950.0      BSE
4       ITC            ITC       NaN   480.0      NSE
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 8 entries, 0 to 7
Data columns (total 5 columns):
 #   Column          Non-Null Count  Dtype  
---  ------          --------------  -----  
 0   Ticker          8 non-null      object 
 1   InstrumentName  8 non-null      object 
 2   Quantity        7 non-null      float64
 3   Price           8 non-null      float64
 4   Exchange        8 non-null      object 
dtypes: float64(2), object(3)
memory usage: 448.0+ bytes
Ticker             object
InstrumentName     object
Quantity          float64
Price             float64
Exchange           object
dtype: object
```

### Q2

**Q.** Read the Debt sheet and show last few rows and shape.

**A.**

```python
debt = pd.read_excel(XL, sheet_name="Debt")
print(debt.tail())
print(debt.shape)
```

```text
          BondID    Issuer  Quantity  Price Rating
1  AAA_CORP_2028  ABC Corp     200.0   98.7    AAA
2   AA_CORP_2027  XYZ Corp     150.0   95.5     AA
3      GSEC_2035       GoI       NaN  101.2    SOV
4   AAA_PSU_2029  PSU Bank     100.0   99.8    AAA
5  AA+_NBFC_2031  NBFC Ltd      75.0   96.3    AA+
(6, 5)
```

`tail()` shows 5 of the 6 rows, so row 0 is not printed. That is correct behaviour.

### Q3

**Q.** Read all sheets into a dictionary and print each sheet's name and shape.

**A.**

```python
sheets = pd.read_excel(XL, sheet_name=None)
for name, d in sheets.items():
    print(name, d.shape)
```

```text
Equity (8, 5)
Debt (6, 5)
```

`sheet_name=None` returns a `dict` of `{sheet name: DataFrame}`.

### Q4

**Q.** From Equity, display only InstrumentName, Quantity, Price.

**A.**

```python
print(eq[["InstrumentName", "Quantity", "Price"]])
```

```text
        InstrumentName  Quantity   Price
0              Infosys     120.0  1700.5
1                  TCS      80.0  3800.0
2            HDFC Bank     150.0  1650.0
3             Reliance      60.0  2950.0
4                  ITC       NaN   480.0
5  State Bank of India     200.0   720.0
6          LTIMindtree      50.0  5500.0
7                Wipro     300.0   460.0
```

### Q5

**Q.** From Equity, filter rows where Quantity is missing or Quantity <= 100.

**A.**

```python
q5 = eq[eq["Quantity"].isna() | (eq["Quantity"] <= 100)]
print(q5)
print("rows:", q5.shape[0])
```

```text
     Ticker InstrumentName  Quantity   Price Exchange
1       TCS            TCS      80.0  3800.0      NSE
3  RELIANCE       Reliance      60.0  2950.0      BSE
4       ITC            ITC       NaN   480.0      NSE
6      LTIM    LTIMindtree      50.0  5500.0      NSE
rows: 4
```

### Q6

**Q.** From Debt, display rows with Rating == "AAA" and Price >= 99.

**A.**

```python
q6 = debt[(debt["Rating"] == "AAA") & (debt["Price"] >= 99)]
print(q6)
print("rows:", q6.shape[0])
```

```text
         BondID    Issuer  Quantity  Price Rating
4  AAA_PSU_2029  PSU Bank     100.0   99.8    AAA
rows: 1
```

One row is the correct answer: `AAA_CORP_2028` is also AAA but priced 98.7, below the cut-off.

### Q7

**Q.** Count missing values per column for both sheets.

**A.**

```python
for name, d in sheets.items():
    print("--", name)
    print(d.isna().sum())
```

```text
-- Equity
Ticker            0
InstrumentName    0
Quantity          1
Price             0
Exchange          0
dtype: int64
-- Debt
BondID      0
Issuer      0
Quantity    1
Price       0
Rating      0
dtype: int64
```

Each sheet has exactly one missing `Quantity` — ITC on Equity, GSEC_2035 on Debt. That single
`NaN` is why `Quantity` is `float64` on both sheets.

### Q8

**Q.** Drop rows from Debt where Quantity is missing and compare shape.

**A.**

```python
debt_clean = debt.dropna(subset=["Quantity"])
print("Debt original:", debt.shape)
print("Debt cleaned :", debt_clean.shape)
```

```text
Debt original: (6, 5)
Debt cleaned : (5, 5)
```

### Q9

**Q.** Fill missing Quantity in Equity with 50 and display affected rows.

**A.** Capture the mask **before** filling.

```python
mask = eq["Quantity"].isna()
eq.loc[mask, "Quantity"] = 50
print(eq.loc[mask])
print("missing Quantity now:", eq["Quantity"].isna().sum())
```

```text
  Ticker InstrumentName  Quantity  Price Exchange
4    ITC            ITC      50.0  480.0      NSE
missing Quantity now: 0
```

### Q10

**Q.** Read only selected columns from Equity and show first 3 rows.

**A.** Select the columns **while reading**, with `usecols`.

```python
print(pd.read_excel(XL, sheet_name="Equity", usecols=["Ticker", "Quantity", "Price"]).head(3))
```

```text
     Ticker  Quantity   Price
0      INFY     120.0  1700.5
1       TCS      80.0  3800.0
2  HDFCBANK     150.0  1650.0
```

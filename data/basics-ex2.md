---
id: basics-ex2
title: "01 Basics — Exercise 2: Loan Applicants"
source: "Pandas exercises/01 Basics/Exercise 2 - Loan Applicants/Loan Applicants.pdf"
datafile: "Pandas exercises/01 Basics/Exercise 2 - Loan Applicants/loan_applicants.csv"
topic: "Profile applicants, filter on two conditions, drop and fill"
group: "Pandas exercises"
order: 31
setup: |
  import pandas as pd

  pd.set_option("display.width", 200)        # so wide frames print in full
  pd.set_option("display.max_columns", None)

  df = pd.read_csv("loan_applicants.csv")
---

### Q1

**Q.** Load the dataset and display first and last few rows.

**A.**

```python
print(df.head())
print(df.tail())
```

```text
   ApplicantID     Name       City     Income  CreditScore  LoanAmountRequested EmploymentType
0         2001    Anita     Mumbai  1200000.0        812.0              2500000       Salaried
1         2002  Bhavesh       Pune   850000.0        730.0              1500000  Self-Employed
2         2003   Chitra      Delhi        NaN        665.0               800000       Salaried
3         2004   Deepak  Bengaluru  1500000.0        748.0              3200000       Salaried
4         2005     Esha    Chennai   600000.0        590.0               500000       Salaried
    ApplicantID   Name       City     Income  CreditScore  LoanAmountRequested EmploymentType
7          2008  Harsh      Delhi   700000.0        780.0              2200000       Salaried
8          2009    Ira    Kolkata   540000.0        640.0               700000  Self-Employed
9          2010  Jatin  Ahmedabad  1300000.0        805.0              2800000       Salaried
10         2011  Kavya    Chennai        NaN        720.0              1000000       Salaried
11         2012  Lalit       Pune   800000.0          NaN              1400000  Self-Employed
```

### Q2

**Q.** Show the shape and column names.

**A.**

```python
print(df.shape)
print(df.columns.tolist())
```

```text
(12, 7)
['ApplicantID', 'Name', 'City', 'Income', 'CreditScore', 'LoanAmountRequested', 'EmploymentType']
```

### Q3

**Q.** Display info and dtypes. Which columns have missing values?

**A.**

```python
df.info()
print(df.dtypes)
print(df.isna().sum())
```

```text
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 12 entries, 0 to 11
Data columns (total 7 columns):
 #   Column               Non-Null Count  Dtype  
---  ------               --------------  -----  
 0   ApplicantID          12 non-null     int64  
 1   Name                 12 non-null     object 
 2   City                 12 non-null     object 
 3   Income               10 non-null     float64
 4   CreditScore          10 non-null     float64
 5   LoanAmountRequested  12 non-null     int64  
 6   EmploymentType       12 non-null     object 
dtypes: float64(2), int64(2), object(3)
memory usage: 800.0+ bytes
ApplicantID              int64
Name                    object
City                    object
Income                 float64
CreditScore            float64
LoanAmountRequested      int64
EmploymentType          object
dtype: object
ApplicantID            0
Name                   0
City                   0
Income                 2
CreditScore            2
LoanAmountRequested    0
EmploymentType         0
dtype: int64
```

`Income` and `CreditScore` each have 2 missing values (10 non-null out of 12), which is also why
both are `float64` rather than `int64`. Every other column is complete.

### Q4

**Q.** Produce descriptive statistics for Income, CreditScore, and LoanAmountRequested, including
percentiles at 0.25, 0.5, 0.75, 0.9.

**A.**

```python
print(df[["Income", "CreditScore", "LoanAmountRequested"]].describe(percentiles=[0.25, 0.5, 0.75, 0.9]))
```

```text
             Income  CreditScore  LoanAmountRequested
count  1.000000e+01    10.000000         1.200000e+01
mean   9.540000e+05   719.200000         1.633333e+06
std    3.154256e+05    72.123043         8.752489e+05
min    5.400000e+05   590.000000         5.000000e+05
25%    7.250000e+05   674.250000         9.500000e+05
50%    9.000000e+05   725.000000         1.450000e+06
75%    1.175000e+06   772.000000         2.275000e+06
90%    1.320000e+06   805.700000         2.770000e+06
max    1.500000e+06   812.000000         3.200000e+06
```

### Q5

**Q.** Select only Name, City, and CreditScore and show first 7 rows.

**A.**

```python
print(df[["Name", "City", "CreditScore"]].head(7))
```

```text
      Name       City  CreditScore
0    Anita     Mumbai        812.0
1  Bhavesh       Pune        730.0
2   Chitra      Delhi        665.0
3   Deepak  Bengaluru        748.0
4     Esha    Chennai        590.0
5     Faiz       Pune          NaN
6    Gauri     Mumbai        702.0
```

### Q6

**Q.** Filter applicants with CreditScore >= 750 and Income >= 1000000.

**A.**

```python
q6 = df[(df["CreditScore"] >= 750) & (df["Income"] >= 1000000)]
print(q6)
print("rows:", q6.shape[0])
```

```text
   ApplicantID   Name       City     Income  CreditScore  LoanAmountRequested EmploymentType
0         2001  Anita     Mumbai  1200000.0        812.0              2500000       Salaried
9         2010  Jatin  Ahmedabad  1300000.0        805.0              2800000       Salaried
rows: 2
```

Only Anita and Jatin clear both bars. Harsh has a score of 780 but income 700000; Deepak has
income 1500000 but a score of 748, two points short.

### Q7

**Q.** Filter applicants where Income is missing or CreditScore < 650.

**A.**

```python
q7 = df[df["Income"].isna() | (df["CreditScore"] < 650)]
print(q7)
print("rows:", q7.shape[0])
```

```text
    ApplicantID    Name     City    Income  CreditScore  LoanAmountRequested EmploymentType
2          2003  Chitra    Delhi       NaN        665.0               800000       Salaried
4          2005    Esha  Chennai  600000.0        590.0               500000       Salaried
8          2009     Ira  Kolkata  540000.0        640.0               700000  Self-Employed
10         2011   Kavya  Chennai       NaN        720.0              1000000       Salaried
rows: 4
```

Faiz and Lalit have a **missing** CreditScore and `NaN < 650` is `False`, so they are excluded.
Add `| df["CreditScore"].isna()` if the examiner wants them too (that gives 6 rows).

### Q8

**Q.** Display boolean mask of missing values for Income and CreditScore and count them per column.

**A.**

```python
print(df[["Income", "CreditScore"]].isna())
print(df[["Income", "CreditScore"]].isna().sum())
```

```text
    Income  CreditScore
0    False        False
1    False        False
2     True        False
3    False        False
4    False        False
5    False         True
6    False        False
7    False        False
8    False        False
9    False        False
10    True        False
11   False         True
Income         2
CreditScore    2
dtype: int64
```

### Q9

**Q.** Drop rows with missing CreditScore and compare the shape with the original.

**A.**

```python
clean = df.dropna(subset=["CreditScore"])
print("original:", df.shape)
print("cleaned :", clean.shape)
```

```text
original: (12, 7)
cleaned : (10, 7)
```

Two rows dropped (Faiz and Lalit); the column count is unchanged.

### Q10

**Q.** Fill missing Income with 800000 and display affected rows.

**A.** Capture the mask **before** filling.

```python
mask = df["Income"].isna()
df.loc[mask, "Income"] = 800000
print(df.loc[mask])
print("missing Income now:", df["Income"].isna().sum())
```

```text
    ApplicantID    Name     City    Income  CreditScore  LoanAmountRequested EmploymentType
2          2003  Chitra    Delhi  800000.0        665.0               800000       Salaried
10         2011   Kavya  Chennai  800000.0        720.0              1000000       Salaried
missing Income now: 0
```

### Q11

**Q.** Show first 5 applicant names where LoanAmountRequested > 2000000 (without sorting).

**A.**

```python
print(df.loc[df["LoanAmountRequested"] > 2000000, "Name"].head(5))
```

```text
0     Anita
3    Deepak
7     Harsh
9     Jatin
Name: Name, dtype: object
```

Only 4 applicants exceed 2,000,000, so `head(5)` returns 4 rows — `head(N)` gives "up to N".
These are in **file order**, which is what "without sorting" asks for.

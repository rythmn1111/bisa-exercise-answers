---
id: pivot-ex2
title: "04 Sorting, Slicing & Pivot — Exercise 2: Retail Bank Loans"
source: "Pandas exercises/04 Sorting, slicing and pivot/Exercise 2/Retail Bank Loans.pdf"
datafile: "Pandas exercises/04 Sorting, slicing and pivot/Exercise 2/bank_loans.csv"
topic: "loc/iloc slicing, multi-key sorting and pivot_table on a retail loan book"
group: "Pandas exercises"
order: 61
setup: |
  import pandas as pd
  pd.set_option("display.width", 200)
  pd.set_option("display.max_columns", 30)
  df = pd.read_csv("bank_loans.csv")   # (80, 10)
---

### QA1

**Q.** Show `loan_id`, `product`, `principal_lakhs` where `risk_grade` in `{"C","D"}` and `secured == False`, sorted by `principal_lakhs` descending.

**A.**

```python
q = df.loc[df["risk_grade"].isin({"C", "D"}) & ~df["secured"],
           ["loan_id", "product", "principal_lakhs"]].sort_values("principal_lakhs", ascending=False)
print(q.shape)
print(q.head(10).to_string(index=False))
```

```text
(25, 3)
 loan_id  product  principal_lakhs
   20032 Personal            29.78
   20039     Auto            29.67
   20023 Personal            27.88
   20036     Home            26.93
   20042 Personal            26.70
   20012     Auto            26.66
   20073     Auto            23.92
   20074      SME            23.68
   20016     Home            20.57
   20048     Auto            17.86
```

### QA2

**Q.** Using `.iloc`, return rows 5:35 and columns 1:8, then sort by the column at position 2 ascending.

**A.** "Position 2" is ambiguous — the column slice starts at 1, so after `iloc[5:35, 1:8]` the columns are renumbered from 0 and position 2 is `risk_grade`, whereas position 2 of the original frame is `product`. Take the in-slice reading and resolve it with `.columns[2]`.

```python
sub = df.iloc[5:35, 1:8]
print("sub.shape:", sub.shape, "| position 2 in the slice:", sub.columns[2],
      "| position 2 in df:", df.columns[2])
q = sub.sort_values(by=sub.columns[2], ascending=True)
print(q.head(8))
```

```text
sub.shape: (30, 7) | position 2 in the slice: risk_grade | position 2 in df: product
    branch   product risk_grade  principal_lakhs  interest_rate  tenure_months  secured
29   Vasco      Auto          A            15.39           8.31            171    False
12   Vasco      Home          A            19.61           9.43            116    False
13   Ponda      Home          A            21.83           9.16            134     True
18  Panaji      Auto          A            19.13          11.29             15    False
17   Vasco  Personal          A            23.36          12.33            207    False
5   Mapusa      Home          B            24.35          11.45            200    False
30  Panaji  Personal          B            30.31          10.86            138     True
28   Vasco       SME          B            18.14           7.41            230     True
```

### QA3

**Q.** Filter loans with `status != "Closed"` and `interest_rate >= 12`, keep `loan_id`, `branch`, `interest_rate`, sort by rate descending.

**A.**

```python
q = df.loc[(df["status"] != "Closed") & (df["interest_rate"] >= 12),
           ["loan_id", "branch", "interest_rate"]].sort_values("interest_rate", ascending=False)
print(q.shape)
print(q.to_string(index=False))
```

```text
(5, 3)
 loan_id branch  interest_rate
   20054 Margao          15.00
   20022  Vasco          12.99
   20049 Panaji          12.66
   20017  Ponda          12.35
   20050 Mapusa          12.03
```

### QA4

**Q.** Using `.loc`, show loans from `branch` in `{"Panaji","Vasco"}` with `tenure_months > 120`, columns `["loan_id","branch","tenure_months"]`.

**A.**

```python
q = df.loc[df["branch"].isin({"Panaji", "Vasco"}) & (df["tenure_months"] > 120),
           ["loan_id", "branch", "tenure_months"]]
print(q.shape)
print(q.head(10).to_string(index=False))
```

```text
(18, 3)
 loan_id branch  tenure_months
   20002  Vasco            169
   20003  Vasco            150
   20005  Vasco            180
   20010 Panaji            138
   20018  Vasco            207
   20025  Vasco            172
   20028  Vasco            171
   20029  Vasco            230
   20030  Vasco            171
   20031 Panaji            138
```

### QA5

**Q.** Using `.iloc`, take every 5th row from 0 to 50 and columns positions `[0, 3, 4, 5]`.

**A.**

```python
q = df.iloc[0:50:5, [0, 3, 4, 5]]
print(q.shape)
print(q.to_string(index=False))
```

```text
(10, 4)
 loan_id risk_grade  principal_lakhs  interest_rate
   20001          B            12.70           7.56
   20006          B            24.35          11.45
   20011          D            11.93          11.29
   20016          C            20.57          11.70
   20021          C            12.46          10.37
   20026          C            29.03           6.13
   20031          B            30.31          10.86
   20036          C            26.93           7.18
   20041          C            17.64           8.84
   20046          D            10.68          10.53
```

### QA6

**Q.** Sort by `branch` ascending and `emi_estimate` descending, return the top 10 rows using slicing.

**A.**

```python
q = df.sort_values(by=["branch", "emi_estimate"], ascending=[True, False])
print(q.iloc[:10][["loan_id", "branch", "product", "emi_estimate"]].to_string(index=False))
```

```text
 loan_id branch  product  emi_estimate
   20016 Mapusa     Home      93113.35
   20057 Mapusa     Auto      72107.05
   20004 Mapusa     Home      58471.38
   20060 Mapusa      SME      58232.52
   20024 Mapusa Personal      35659.54
   20065 Mapusa      SME      33332.16
   20026 Mapusa      SME      31301.22
   20039 Mapusa     Auto      28303.99
   20006 Mapusa     Home      27323.63
   20050 Mapusa     Home      26477.08
```

All ten rows are `Mapusa` — it sorts first and has sixteen loans.

### QA7

**Q.** Select loans where `product == "SME"` or (`product == "Auto"` and `interest_rate < 8`), columns `loan_id`, `product`, `interest_rate`.

**A.** Bracket the inner `and` group as a unit.

```python
q = df.loc[(df["product"] == "SME")
           | ((df["product"] == "Auto") & (df["interest_rate"] < 8)),
           ["loan_id", "product", "interest_rate"]]
print(q.shape)
print(q.head(12).to_string(index=False))
```

```text
(16, 3)
 loan_id product  interest_rate
   20007     SME          11.05
   20009     SME          12.38
   20015     SME           9.43
   20020     SME          10.81
   20026     SME           6.13
   20029     SME           7.41
   20039    Auto           5.84
   20040     SME          10.78
   20060     SME          11.02
   20063     SME          11.88
   20065     SME          10.80
   20069    Auto           7.29
```

### QA8

**Q.** Sort by `risk_grade` then by `principal_lakhs` (descending), and return rows 20–39 using `.iloc`.

**A.**

```python
q = df.sort_values(by=["risk_grade", "principal_lakhs"], ascending=[True, False])
print(q.iloc[20:40][["loan_id", "risk_grade", "principal_lakhs"]].to_string(index=False))
```

```text
 loan_id risk_grade  principal_lakhs
   20038          B            24.51
   20006          B            24.35
   20075          B            22.06
   20024          B            21.92
   20043          B            20.57
   20065          B            19.43
   20053          B            19.41
   20029          B            18.14
   20034          B            16.67
   20002          B            16.35
   20078          B            16.01
   20001          B            12.70
   20007          B            12.62
   20020          B            11.59
   20009          B             8.00
   20025          B             6.49
   20054          B             4.83
   20037          B             2.00
   20052          C            30.42
   20003          C            30.07
```

### QB1

**Q.** Sum `principal_lakhs` by `branch` × `product` (`fill_value=0`, with totals).

**A.** "With totals" is `margins=True, margins_name="Total"`.

```python
print(df.pivot_table(index="branch", columns="product", values="principal_lakhs",
                     aggfunc="sum", fill_value=0,
                     margins=True, margins_name="Total").round(2))
```

```text
product    Auto    Home  Personal     SME    Total
branch                                            
Mapusa    78.21  105.57     21.92   94.02   299.72
Margao    54.54  114.13    131.06    8.00   307.73
Panaji    62.44   41.10     92.31   11.59   207.44
Ponda    109.15   59.15     34.99   71.02   274.31
Vasco    104.07   73.65    152.14   39.03   368.89
Total    408.41  393.60    432.42  223.66  1458.09
```

Every `branch × product` pair exists, so nothing was filled.

### QB2

**Q.** Mean `interest_rate` by `risk_grade` × `product`.

**A.**

```python
print(df.pivot_table(index="risk_grade", columns="product", values="interest_rate",
                     aggfunc="mean").round(2))
```

```text
product      Auto  Home  Personal    SME
risk_grade                              
A           10.35  9.88     10.60   8.18
B            8.95  9.85      9.83  10.49
C            9.56  8.94     10.49   9.25
D            9.85  8.17      8.68  10.78
```

### QB3

**Q.** Count of loans by `status` × `branch` (count `loan_id`).

**A.**

```python
print(df.pivot_table(index="status", columns="branch", values="loan_id",
                     aggfunc="count", fill_value=0))
```

```text
branch      Mapusa  Margao  Panaji  Ponda  Vasco
status                                          
Closed           4       6       2      5      7
Current          4       8       3      3      5
Delinquent       8       2       7      8      8
```

### QB4

**Q.** Std of `emi_estimate` by `product` × `secured`.

**A.** `secured` is a `bool`, so the column labels are `False` / `True`.

```python
print(df.pivot_table(index="product", columns="secured", values="emi_estimate",
                     aggfunc="std").round(2))
```

```text
secured      False     True 
product                     
Auto      32761.21  21790.28
Home      23678.51  13944.58
Personal   8411.56  33003.82
SME       19238.97   9370.28
```

### QB5

**Q.** Multiple aggs (sum, mean) of `principal_lakhs` by `branch` × `status` and flatten.

**A.**

```python
pt = df.pivot_table(index="branch", columns="status", values="principal_lakhs",
                    aggfunc=["sum", "mean"])
pt.columns = [f"{a}_{b}" for a, b in pt.columns]
print(pt.round(2))
```

```text
        sum_Closed  sum_Current  sum_Delinquent  mean_Closed  mean_Current  mean_Delinquent
branch                                                                                     
Mapusa       94.59        70.94          134.19        23.65         17.74            16.77
Margao      112.42       166.84           28.47        18.74         20.86            14.24
Panaji       60.73        39.75          106.96        30.36         13.25            15.28
Ponda        74.40        41.29          158.62        14.88         13.76            19.83
Vasco       105.74        85.50          177.65        15.11         17.10            22.21
```

### QB6

**Q.** Multiple values (`principal_lakhs`, `emi_estimate`) summed by `product` × `branch`; optional flatten.

**A.**

```python
pt = df.pivot_table(index="product", columns="branch",
                    values=["principal_lakhs", "emi_estimate"],
                    aggfunc="sum", fill_value=0)
print(pt.round(2))
pt.columns = [f"{v}_{b}" for v, b in pt.columns]
print(list(pt.columns))
```

```text
         emi_estimate                                             principal_lakhs                               
branch         Mapusa     Margao     Panaji      Ponda      Vasco          Mapusa  Margao Panaji   Ponda   Vasco
product                                                                                                         
Auto        133772.45   67769.17  194397.26  164840.04  140541.60           78.21   54.54  62.44  109.15  104.07
Home        224506.04  173879.37   56659.33   73296.73   85563.54          105.57  114.13  41.10   59.15   73.65
Personal     35659.54  152632.18  126749.08  141188.64  218920.17           21.92  131.06  92.31   34.99  152.14
SME         154575.04   12788.78   41851.31  116276.14   33974.53           94.02    8.00  11.59   71.02   39.03
['emi_estimate_Mapusa', 'emi_estimate_Margao', 'emi_estimate_Panaji', 'emi_estimate_Ponda', 'emi_estimate_Vasco', 'principal_lakhs_Mapusa', 'principal_lakhs_Margao', 'principal_lakhs_Panaji', 'principal_lakhs_Ponda', 'principal_lakhs_Vasco']
```

### QB7

**Q.** Variance of `interest_rate` by `risk_grade` × `product`.

**A.**

```python
print(df.pivot_table(index="risk_grade", columns="product", values="interest_rate",
                     aggfunc="var").round(3))
print(df.groupby(["risk_grade", "product"]).size().unstack(fill_value=0))
```

```text
product      Auto    Home  Personal    SME
risk_grade                                
A           4.797   2.088     2.676    NaN
B           0.416  11.463     2.288  3.393
C           5.223   4.713     3.562  4.212
D           1.799   4.380     0.094    NaN
product     Auto  Home  Personal  SME
risk_grade                           
A              6     4         6    1
B              3     6         7    5
C              7     8         5    6
D              8     3         4    1
```

The two `NaN`s are not empty cells: `A × SME` and `D × SME` hold exactly one loan each and sample variance (`ddof=1`) of a single value is undefined. Do not mask them with `fill_value=0` — a variance of 0 is a different claim.

### QB8

**Q.** First and last `tenure_months` by `branch` × `product` (flatten).

**A.**

```python
pt = df.pivot_table(index="branch", columns="product", values="tenure_months",
                    aggfunc=["first", "last"])
pt.columns = [f"{a}_{b}" for a, b in pt.columns]
print(pt)
```

```text
        first_Auto  first_Home  first_Personal  first_SME  last_Auto  last_Home  last_Personal  last_SME
branch                                                                                                  
Mapusa         114          48              80        126         46        145             80       164
Margao         225         110             184        101        102         71            200       101
Panaji         117          71             138         32        120        103            197        32
Ponda          115         134              55         42         16         86             24        96
Vasco          169         150             180        230        113        171            231       201
```

Where `first_X == last_X` (`Mapusa`/`Personal` = 80, `Panaji`/`SME` = 32) the group has only one loan.

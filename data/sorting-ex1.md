---
id: sorting-ex1
title: "03 Sorting & Slicing — Exercise A: Loan Transactions"
source: "Pandas exercises/03 Sorting and slicing in Pandas/Exercise 1 - Loan Transactions/Exercise 1 - Loan transactions.pdf"
datafile: "Pandas exercises/03 Sorting and slicing in Pandas/Exercise 1 - Loan Transactions/EX_A_loan_transactions.csv"
topic: "Label vs positional slicing, date-index slicing, two-key sorting"
group: "Pandas exercises"
order: 50
setup: |
  import pandas as pd
  pd.set_option("display.width", 200)
  pd.set_option("display.max_columns", 20)

  loans = pd.read_csv("EX_A_loan_transactions.csv")   # (200, 8)

  # The question paper's column names are stale. The real ones:
  # City -> Branch, Revenue / "Total disbursed amount" -> DisbursedAmount,
  # "loan amount" -> PerBorrowerAmount, LoanID 1010-1020 -> 11010-11020.
  print(loans.columns.tolist())
  # ['LoanID', 'Date', 'Branch', 'LoanProduct', 'NumBorrowers',
  #  'PerBorrowerAmount', 'DisbursedAmount', 'Channel']
---

### Q1

**Q.** Display the first 10 loan records and the last 10 loan records.

**A.**

```python
print(loans.head(10))
print(loans.tail(10))
```

```text
   LoanID        Date     Branch     LoanProduct  NumBorrowers  PerBorrowerAmount  DisbursedAmount Channel
0   11001  2024-01-01  Bengaluru   Personal Loan             3             300000           900000  Branch
1   11002  2024-01-02  Hyderabad        SME Loan             3            1000000          3000000  Online
2   11003  2024-01-03     Mumbai       Auto Loan             5             500000          2500000  Online
3   11004  2024-01-04     Mumbai       Home Loan             4             300000          1200000  Branch
4   11005  2024-01-05       Pune       Auto Loan             2             500000          1000000  Online
5   11006  2024-01-06       Pune  Education Loan             1            1000000          1000000  Online
6   11007  2024-01-07  Bengaluru  Education Loan             2            1000000          2000000  Branch
7   11008  2024-01-08      Delhi   Personal Loan             1            1000000          1000000  Branch
8   11009  2024-01-09     Mumbai       Auto Loan             3            1000000          3000000  Online
9   11010  2024-01-10      Delhi   Personal Loan             4            1000000          4000000  Branch
     LoanID        Date     Branch     LoanProduct  NumBorrowers  PerBorrowerAmount  DisbursedAmount Channel
190   11191  2024-07-09       Pune        SME Loan             2             150000           300000  Branch
191   11192  2024-07-10     Mumbai       Auto Loan             2            1000000          2000000  Branch
192   11193  2024-07-11     Mumbai  Education Loan             3            2000000          6000000  Online
193   11194  2024-07-12  Bengaluru   Personal Loan             5             500000          2500000  Branch
194   11195  2024-07-13     Mumbai        SME Loan             5             500000          2500000  Branch
195   11196  2024-07-14  Hyderabad        SME Loan             4            2000000          8000000  Branch
196   11197  2024-07-15  Bengaluru        SME Loan             3            1000000          3000000  Online
197   11198  2024-07-16       Pune       Home Loan             5             300000          1500000  Branch
198   11199  2024-07-17  Hyderabad       Auto Loan             1            1000000          1000000  Online
199   11200  2024-07-18  Bengaluru  Education Loan             2             150000           300000  Online
```

### Q2

**Q.** Show loans from LoanID 1010 to 1020 along with the columns from City to Revenue.

**A.**

Answered with the real columns, since the file has no `City` and no `Revenue` at all: `City` is `Branch`, `Revenue` is `DisbursedAmount`, and `LoanID` runs 11001–11200, so `1010`–`1020` is read as `11010`–`11020`.

```python
l = loans.set_index("LoanID")
print(l.loc[11010:11020, "Branch":"DisbursedAmount"])
print("rows:", l.loc[11010:11020].shape[0])
```

```text
           Branch     LoanProduct  NumBorrowers  PerBorrowerAmount  DisbursedAmount
LoanID
11010       Delhi   Personal Loan             4            1000000          4000000
11011        Pune        SME Loan             1             150000           150000
11012       Delhi        SME Loan             5             300000          1500000
11013   Hyderabad       Auto Loan             5            2000000         10000000
11014        Pune        SME Loan             3            2000000          6000000
11015   Bengaluru        SME Loan             4             300000          1200000
11016   Bengaluru       Home Loan             3             300000           900000
11017      Mumbai       Auto Loan             5             150000           750000
11018   Bengaluru   Personal Loan             4             500000          2000000
11019      Mumbai   Personal Loan             2            1000000          2000000
11020      Mumbai  Education Loan             1            2000000          2000000
rows: 11
```

Eleven rows, because `.loc` includes the stop label. Written with the printed IDs it fails **silently** — a label slice that matches nothing returns an empty frame rather than an error, so the only symptom is a shape of `(0, 7)`:

```python
print(l.loc[1010:1020].shape)
print(l.loc[1010:1020])
```

```text
(0, 7)
Empty DataFrame
Columns: [Date, Branch, LoanProduct, NumBorrowers, PerBorrowerAmount, DisbursedAmount, Channel]
Index: []
```

### Q3

**Q.** From the first 15 loans, display only the first four columns.

**A.**

```python
print(loans.iloc[:15, :4])
```

```text
    LoanID        Date     Branch     LoanProduct
0    11001  2024-01-01  Bengaluru   Personal Loan
1    11002  2024-01-02  Hyderabad        SME Loan
2    11003  2024-01-03     Mumbai       Auto Loan
3    11004  2024-01-04     Mumbai       Home Loan
4    11005  2024-01-05       Pune       Auto Loan
5    11006  2024-01-06       Pune  Education Loan
6    11007  2024-01-07  Bengaluru  Education Loan
7    11008  2024-01-08      Delhi   Personal Loan
8    11009  2024-01-09     Mumbai       Auto Loan
9    11010  2024-01-10      Delhi   Personal Loan
10   11011  2024-01-11       Pune        SME Loan
11   11012  2024-01-12      Delhi        SME Loan
12   11013  2024-01-13  Hyderabad       Auto Loan
13   11014  2024-01-14       Pune        SME Loan
14   11015  2024-01-15  Bengaluru        SME Loan
```

### Q4

**Q.** Filter transactions where the City is Mumbai or Pune and the number of borrowers is at least 3, then sort them by City ascending and within each city by Total disbursed amount descending.

**A.**

Reading `City` as `Branch` and "Total disbursed amount" as `DisbursedAmount`.

```python
q4 = loans.loc[loans["Branch"].isin(["Mumbai", "Pune"]) & (loans["NumBorrowers"] >= 3)]
q4 = q4.sort_values(by=["Branch", "DisbursedAmount"], ascending=[True, False])
print(q4.shape)
print(q4.head(10))
```

```text
(47, 8)
     LoanID        Date  Branch     LoanProduct  NumBorrowers  PerBorrowerAmount  DisbursedAmount Channel
24    11025  2024-01-25  Mumbai       Home Loan             5            2000000         10000000  Branch
46    11047  2024-02-16  Mumbai       Auto Loan             3            2000000          6000000  Online
171   11172  2024-06-20  Mumbai        SME Loan             3            2000000          6000000  Online
192   11193  2024-07-11  Mumbai  Education Loan             3            2000000          6000000  Online
25    11026  2024-01-26  Mumbai  Education Loan             4            1000000          4000000  Online
102   11103  2024-04-12  Mumbai        SME Loan             4            1000000          4000000  Branch
8     11009  2024-01-09  Mumbai       Auto Loan             3            1000000          3000000  Online
184   11185  2024-07-03  Mumbai  Education Loan             3            1000000          3000000  Online
2     11003  2024-01-03  Mumbai       Auto Loan             5             500000          2500000  Online
93    11094  2024-04-03  Mumbai  Education Loan             5             500000          2500000  Online
```

47 rows survive the filter.

### Q5

**Q.** Sort the dataset by Date ascending and show the first 14 loan records.

**A.**

```python
print(loans.sort_values("Date").head(14))
```

```text
    LoanID        Date     Branch     LoanProduct  NumBorrowers  PerBorrowerAmount  DisbursedAmount Channel
0    11001  2024-01-01  Bengaluru   Personal Loan             3             300000           900000  Branch
1    11002  2024-01-02  Hyderabad        SME Loan             3            1000000          3000000  Online
2    11003  2024-01-03     Mumbai       Auto Loan             5             500000          2500000  Online
3    11004  2024-01-04     Mumbai       Home Loan             4             300000          1200000  Branch
4    11005  2024-01-05       Pune       Auto Loan             2             500000          1000000  Online
5    11006  2024-01-06       Pune  Education Loan             1            1000000          1000000  Online
6    11007  2024-01-07  Bengaluru  Education Loan             2            1000000          2000000  Branch
7    11008  2024-01-08      Delhi   Personal Loan             1            1000000          1000000  Branch
8    11009  2024-01-09     Mumbai       Auto Loan             3            1000000          3000000  Online
9    11010  2024-01-10      Delhi   Personal Loan             4            1000000          4000000  Branch
10   11011  2024-01-11       Pune        SME Loan             1             150000           150000  Online
11   11012  2024-01-12      Delhi        SME Loan             5             300000          1500000  Online
12   11013  2024-01-13  Hyderabad       Auto Loan             5            2000000         10000000  Online
13   11014  2024-01-14       Pune        SME Loan             3            2000000          6000000  Branch
```

The file already arrives in date order, so the sort leaves the index 0–13.

### Q6

**Q.** After setting Date as the index, slice the records from 2024-01-10 to 2024-01-20.

**A.**

`Date` arrives as text, so convert it with `pd.to_datetime` before `set_index`, otherwise you get a string index and only exact-length date strings will slice.

```python
LD = loans.assign(Date=pd.to_datetime(loans["Date"])).set_index("Date").sort_index()
q6 = LD.loc["2024-01-10":"2024-01-20"]
print(q6)
print("rows:", q6.shape[0])
```

```text
            LoanID     Branch     LoanProduct  NumBorrowers  PerBorrowerAmount  DisbursedAmount Channel
Date
2024-01-10   11010      Delhi   Personal Loan             4            1000000          4000000  Branch
2024-01-11   11011       Pune        SME Loan             1             150000           150000  Online
2024-01-12   11012      Delhi        SME Loan             5             300000          1500000  Online
2024-01-13   11013  Hyderabad       Auto Loan             5            2000000         10000000  Online
2024-01-14   11014       Pune        SME Loan             3            2000000          6000000  Branch
2024-01-15   11015  Bengaluru        SME Loan             4             300000          1200000  Branch
2024-01-16   11016  Bengaluru       Home Loan             3             300000           900000  Online
2024-01-17   11017     Mumbai       Auto Loan             5             150000           750000  Online
2024-01-18   11018  Bengaluru   Personal Loan             4             500000          2000000  Online
2024-01-19   11019     Mumbai   Personal Loan             2            1000000          2000000  Online
2024-01-20   11020     Mumbai  Education Loan             1            2000000          2000000  Online
rows: 11
```

Both the 10th and the 20th are in the result.

### Q7

**Q.** Compare the result of selecting the loan with LoanID 1015 versus selecting the 15th row by position.

**A.**

Reading `1015` as `11015`.

```python
L = loans.set_index("LoanID")
print(L.loc[11015])       # by label
print(loans.iloc[14])     # the 15th row by position (0-based)
```

```text
Date                 2024-01-15
Branch                Bengaluru
LoanProduct            SME Loan
NumBorrowers                  4
PerBorrowerAmount        300000
DisbursedAmount         1200000
Channel                  Branch
Name: 11015, dtype: object
LoanID                    11015
Date                 2024-01-15
Branch                Bengaluru
LoanProduct            SME Loan
NumBorrowers                  4
PerBorrowerAmount        300000
DisbursedAmount         1200000
Channel                  Branch
Name: 14, dtype: object
```

Same loan — but by coincidence, not by rule: `LoanID` runs 11001, 11002, … so label = position + 11001, and 11015 happens to sit at position 14. `.loc` looked up the *label* 11015; `.iloc` counted 14 rows down. The same coincidence does not survive a slice, which is where the inclusive/exclusive difference shows:

```python
print("loc  ->", L.loc[11015:11020].shape[0], "rows, labels", list(L.loc[11015:11020].index))
print("iloc ->", L.iloc[15:20].shape[0], "rows, labels", list(L.iloc[15:20].index))
```

```text
loc  -> 6 rows, labels [11015, 11016, 11017, 11018, 11019, 11020]
iloc -> 5 rows, labels [11016, 11017, 11018, 11019, 11020]
```

`.loc` **includes** the stop label (6 rows); `.iloc` **excludes** the stop position (5 rows).

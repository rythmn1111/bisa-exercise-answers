---
id: session13
title: "Session 13 — Pandas Practice Exercises"
source: "Pandas exercises/Class exercises/Pandas_Session13_Exercises.pdf"
datafile:
  - "Pandas exercises/Class exercises/customers.csv"
  - "Pandas exercises/Class exercises/customers_semicolon.csv"
  - "Pandas exercises/Class exercises/customers_tab.tsv"
  - "Pandas exercises/Class exercises/customers_preamble.csv"
  - "Pandas exercises/Class exercises/Pandas_Session13_Practice_Data.xlsx"
topic: "Series/DataFrame, file I/O, inspection, filtering, axis, inplace, missing data, loc/iloc, sorting, pivot_table"
group: "Pandas exercises"
order: 20
setup: |
  import tempfile
  import pandas as pd

  # Paths are relative to the exercise folder; point BASE at yours.
  BASE = ""
  W    = BASE + "Pandas_Session13_Practice_Data.xlsx"
  OUT  = tempfile.mkdtemp()          # scratch folder for the export exercises (21-32)

  pd.set_option("display.width", 200)
  pd.set_option("display.max_columns", 30)

  # the sheet most of the set uses
  df = pd.read_excel(W, sheet_name="Customer_Data")
---

### Q1

**Q.** Install pandas if needed, then import it using the alias shown in the slides.

**A.**

```python
# pip install pandas          (in a terminal; in a notebook: !pip install pandas)
import pandas as pd
print(pd.__version__)
```

```text
2.3.3
```

### Q2

**Q.** Create a Series containing 12, 18, 25, 31 without specifying an index. Print it and observe the default index.

**A.**

```python
s = pd.Series([12, 18, 25, 31])
print(s)
```

```text
0    12
1    18
2    25
3    31
dtype: int64
```

The default index is a RangeIndex 0-3.

### Q3

**Q.** Create a Series containing 100, 200, 300 with labels A, B, C. Print it.

**A.**

```python
print(pd.Series([100, 200, 300], index=["A", "B", "C"]))
```

```text
A    100
B    200
C    300
dtype: int64
```

### Q4

**Q.** Create a DataFrame from a dictionary with columns Name, Age and City and at least four rows. Print the DataFrame.

**A.**

```python
people = pd.DataFrame({"Name": ["Aarav Mehta", "Diya Nair", "Kabir Shah", "Meera Iyer"],
                       "Age":  [53, 32, 24, 25],
                       "City": ["Pune", "Hyderabad", "Mumbai", "Goa"]})
print(people)
```

```text
          Name  Age       City
0  Aarav Mehta   53       Pune
1    Diya Nair   32  Hyderabad
2   Kabir Shah   24     Mumbai
3   Meera Iyer   25        Goa
```

### Q5

**Q.** Read `customers.csv` into a DataFrame and display it.

**A.**

```python
cust = pd.read_csv(BASE + "customers.csv")
print(cust)
```

```text
   Customer_ID            Name  Age       City  Segment    Balance  Risk_Score Active   Join_Date
0         C001     Aarav Mehta   53       Pune      SME  140976.60         550    Yes  2025-05-30
1         C002       Diya Nair   32  Hyderabad      SME  474709.96         546     No  2024-06-25
2         C003      Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes  2024-06-02
3         C004      Meera Iyer   34  Bengaluru      SME   25706.89         392    Yes  2024-08-02
4         C005     Rohan Desai   30     Mumbai      SME  303206.73         726     No  2024-06-29
5         C006      Ananya Rao   38      Delhi  Premium   64403.42         629    Yes  2025-02-23
6         C007    Arjun Kapoor   23        Goa      SME  757356.26         729    Yes  2025-01-19
7         C008      Ishita Sen   31    Chennai   Retail  160552.98         327    Yes  2024-02-08
8         C009    Vikram Joshi   31  Bengaluru  Premium  602935.52         377    Yes  2025-08-05
9         C010  Nisha Kulkarni   39        Goa  Premium  543586.83         744    Yes  2025-11-26
10        C011      Rahul Naik   46     Mumbai  Premium  255878.95         753    Yes  2024-08-06
11        C012     Sneha Patil   27    Kolkata  Premium  855113.18         386    Yes  2024-01-20
12        C013  Karan Malhotra   35       Pune      SME   36203.57         822    Yes  2025-10-19
13        C014     Pooja Menon   28    Kolkata      SME  348554.39         668    Yes  2025-03-08
14        C015    Aditya Verma   55     Mumbai      SME  622959.23         659     No  2025-08-17
15        C016      Tanvi Bhat   34      Delhi  Premium  478955.46         624     No  2024-12-15
16        C017     Sameer Khan   47      Delhi   Retail  143902.09         521    Yes  2025-08-23
17        C018       Riya Bose   40  Hyderabad   Retail   42145.93         824     No  2024-10-04
18        C019     Nikhil Jain   41      Delhi  Premium  817061.38         598    Yes  2024-12-10
19        C020     Aditi Sinha   51    Kolkata  Premium  587360.57         472    Yes  2025-04-27
20        C021    Varun Shetty   51        Goa      SME  912373.95         338    Yes  2024-04-17
21        C022      Neha Reddy   44       Pune   Retail  113111.99         442    Yes  2024-07-25
22        C023     Sahil Gupta   41  Hyderabad      SME  804716.53         769    Yes  2025-08-15
23        C024  Maya Fernandes   49      Delhi      SME  670030.64         395    Yes  2024-02-15
24        C025       Dev Patel   58    Kolkata      SME  549323.95         784    Yes  2024-05-18
25        C026    Leena Thomas   28        Goa      SME  636829.40         529     No  2024-12-06
26        C027    Omkar Sawant   52     Mumbai  Premium   39194.67         780     No  2025-04-29
27        C028    Kavya Pillai   31    Kolkata   Retail   35264.58         431    Yes  2024-08-01
28        C029   Harsh Agarwal   25        Goa   Retail  691394.29         820     No  2025-06-23
29        C030      Zoya Mirza   25  Hyderabad  Premium   35859.42         569    Yes  2025-01-20
```

### Q6

**Q.** Read `customers.csv` while explicitly stating that the separator is a comma.

**A.**

```python
cust_comma = pd.read_csv(BASE + "customers.csv", sep=",")
print(cust_comma.shape)
print(cust_comma.equals(pd.read_csv(BASE + "customers.csv")))
```

```text
(30, 9)
True
```

`sep=","` is the default, so the result is identical to Q5.

### Q7

**Q.** Read the semicolon-separated file `customers_semicolon.csv` correctly. First try reading it without `sep` and observe what goes wrong.

**A.**

```python
semi = pd.read_csv(BASE + "customers_semicolon.csv", sep=";")
print(semi.head(3))
print(semi.shape)
print(pd.read_csv(BASE + "customers_semicolon.csv").shape)
```

```text
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active   Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes  2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No  2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes  2024-06-02
(30, 9)
(30, 1)
```

Without `sep` there is no comma to split on, so all nine fields arrive as one fat column - shape `(30, 1)` and a column name that is the whole header line.

### Q8

**Q.** Read the tab-separated file `customers_tab.tsv` correctly.

**A.**

```python
tab = pd.read_csv(BASE + "customers_tab.tsv", sep="\t")
print(tab.head(3))
print(tab.shape)
```

```text
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active   Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes  2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No  2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes  2024-06-02
(30, 9)
```

### Q9

**Q.** Read `customers.csv` and use the first column as the row labels.

**A.**

```python
idx0 = pd.read_csv(BASE + "customers.csv", index_col=0)
print(idx0.head(3))
print(idx0.shape)
```

```text
                    Name  Age       City  Segment    Balance  Risk_Score Active   Join_Date
Customer_ID                                                                                
C001         Aarav Mehta   53       Pune      SME  140976.60         550    Yes  2025-05-30
C002           Diya Nair   32  Hyderabad      SME  474709.96         546     No  2024-06-25
C003          Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes  2024-06-02
(30, 8)
```

### Q10

**Q.** Read only Customer_ID, Name and Age from `customers.csv`.

**A.**

```python
three = pd.read_csv(BASE + "customers.csv", usecols=["Customer_ID", "Name", "Age"])
print(three.head(3))
print(three.shape)
```

```text
  Customer_ID         Name  Age
0        C001  Aarav Mehta   53
1        C002    Diya Nair   32
2        C003   Kabir Shah   52
(30, 3)
```

### Q11

**Q.** Read only the first 10 data rows of `customers.csv`.

**A.**

```python
first10 = pd.read_csv(BASE + "customers.csv", nrows=10)
print(first10.shape)
print(first10)
```

```text
(10, 9)
  Customer_ID            Name  Age       City  Segment    Balance  Risk_Score Active   Join_Date
0        C001     Aarav Mehta   53       Pune      SME  140976.60         550    Yes  2025-05-30
1        C002       Diya Nair   32  Hyderabad      SME  474709.96         546     No  2024-06-25
2        C003      Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes  2024-06-02
3        C004      Meera Iyer   34  Bengaluru      SME   25706.89         392    Yes  2024-08-02
4        C005     Rohan Desai   30     Mumbai      SME  303206.73         726     No  2024-06-29
5        C006      Ananya Rao   38      Delhi  Premium   64403.42         629    Yes  2025-02-23
6        C007    Arjun Kapoor   23        Goa      SME  757356.26         729    Yes  2025-01-19
7        C008      Ishita Sen   31    Chennai   Retail  160552.98         327    Yes  2024-02-08
8        C009    Vikram Joshi   31  Bengaluru  Premium  602935.52         377    Yes  2025-08-05
9        C010  Nisha Kulkarni   39        Goa  Premium  543586.83         744    Yes  2025-11-26
```

### Q12

**Q.** Skip the first line of `customers_preamble.csv` and load the actual table.

**A.**

```python
pre = pd.read_csv(BASE + "customers_preamble.csv", skiprows=1)
print(pre.head(3))
print(pre.shape)
```

```text
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active   Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes  2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No  2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes  2024-06-02
(30, 9)
```

### Q13

**Q.** Read `customers.csv` with `header=0` explicitly specified. Compare the result with Q5.

**A.**

```python
h0 = pd.read_csv(BASE + "customers.csv", header=0)
print(h0.equals(pd.read_csv(BASE + "customers.csv")))
print(h0.head(3))
```

```text
True
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active   Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes  2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No  2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes  2024-06-02
```

`header=0` is the default, so the two frames are identical.

### Q14

**Q.** In one command, read Customer_ID, Name and Age, use Customer_ID as the index, and load only the first 5 rows. Note that `index_col` must refer to a column that is also listed in `usecols`.

**A.**

```python
small = pd.read_csv(BASE + "customers.csv",
                    usecols=["Customer_ID", "Name", "Age"],
                    index_col="Customer_ID",
                    nrows=5)
print(small)
```

```text
                    Name  Age
Customer_ID                  
C001         Aarav Mehta   53
C002           Diya Nair   32
C003          Kabir Shah   52
C004          Meera Iyer   34
C005         Rohan Desai   30
```

### Q15

**Q.** Read the first worksheet of the practice workbook by its 0-based sheet index.

**A.**

```python
print(pd.read_excel(W, sheet_name=0).head(3))
```

```text
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active  Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes 2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No 2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes 2024-06-02
```

### Q16

**Q.** Read the worksheet named Customer_Data.

**A.**

```python
print(pd.read_excel(W, sheet_name="Customer_Data").head(3))
```

```text
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active  Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes 2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No 2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes 2024-06-02
```

### Q17

**Q.** Read only columns A:C of Customer_Data.

**A.**

```python
print(pd.read_excel(W, sheet_name="Customer_Data", usecols="A:C").head(3))
```

```text
  Customer_ID         Name  Age
0        C001  Aarav Mehta   53
1        C002    Diya Nair   32
2        C003   Kabir Shah   52
```

### Q18

**Q.** Load the Import_SkipRows table by skipping the first two non-data rows. This sheet holds 18 customers, not 30 - that is intentional.

**A.**

```python
skip = pd.read_excel(W, sheet_name="Import_SkipRows", skiprows=2)
print(skip.shape)
print(skip.head(3))
```

```text
(18, 9)
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active  Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes 2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No 2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes 2024-06-02
```

### Q19

**Q.** Read every sheet in the workbook at once. Display the returned object's type and the sheet names it contains.

**A.**

```python
sheets = pd.read_excel(W, sheet_name=None)
print(type(sheets))
print(list(sheets.keys()))
```

```text
<class 'dict'>
['Customer_Data', 'Import_SkipRows', 'Missing_Data', 'Missing_Tokens', 'Indexed_Data', 'Scores_Axis', 'Sorting_Data', 'Sales_Pivot', 'Sales', 'Marketing', 'Dates_Export']
```

### Q20

**Q.** Move a copy of `customers.csv` to another folder and read it using a complete absolute path. On Windows try forward slashes and a raw string path; on macOS or Linux use a normal forward-slash path.

**A.**

```python
import shutil
copied = shutil.copy(BASE + "customers.csv", OUT + "/customers.csv")

abs_df = pd.read_csv(copied)          # macOS / Linux: plain forward-slash absolute path
print(abs_df.shape)

# Windows - the same file, three legal spellings:
# pd.read_csv("C:/Users/you/Documents/customers.csv")       # forward slashes
# pd.read_csv(r"C:\Users\you\Documents\customers.csv")    # raw string
# pd.read_csv("C:\\Users\\you\\Documents\\customers.csv")  # escaped backslashes
```

```text
(30, 9)
```

### Q21

**Q.** Export the Customer_Data DataFrame to `output_customers.csv` without writing the index.

**A.**

```python
df.to_csv(OUT + "/output_customers.csv", index=False)
print(pd.read_csv(OUT + "/output_customers.csv").columns.tolist())
```

```text
['Customer_ID', 'Name', 'Age', 'City', 'Segment', 'Balance', 'Risk_Score', 'Active', 'Join_Date']
```

No `Unnamed: 0` column on the way back, which is the proof that the index was not written.

### Q22

**Q.** Export the DataFrame using a semicolon as the delimiter.

**A.**

```python
df.to_csv(OUT + "/customers_semi.csv", sep=";", index=False)
print(open(OUT + "/customers_semi.csv").readline().strip())
```

```text
Customer_ID;Name;Age;City;Segment;Balance;Risk_Score;Active;Join_Date
```

### Q23

**Q.** Export only Name, City and Balance to a new CSV file, without the index.

**A.**

```python
df.to_csv(OUT + "/customers_three.csv", columns=["Name", "City", "Balance"], index=False)
print(open(OUT + "/customers_three.csv").readline().strip())
print(pd.read_csv(OUT + "/customers_three.csv").head(3))
```

```text
Name,City,Balance
          Name       City    Balance
0  Aarav Mehta       Pune  140976.60
1    Diya Nair  Hyderabad  474709.96
2   Kabir Shah    Kolkata  110395.82
```

### Q24

**Q.** Write the DataFrame to `output.xlsx` on a sheet named Summary, without the index.

**A.**

```python
df.to_excel(OUT + "/output.xlsx", sheet_name="Summary", index=False)
print(pd.ExcelFile(OUT + "/output.xlsx").sheet_names)
print(pd.read_excel(OUT + "/output.xlsx", sheet_name="Summary").head(3))
```

```text
['Summary']
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active  Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes 2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No 2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes 2024-06-02
```

### Q25

**Q.** Read Sales and Marketing into separate DataFrames and write both into one new workbook on separate worksheets.

**A.**

```python
sales     = pd.read_excel(W, sheet_name="Sales")
marketing = pd.read_excel(W, sheet_name="Marketing")

with pd.ExcelWriter(OUT + "/sales_marketing.xlsx") as writer:
    sales.to_excel(writer, sheet_name="Sales", index=False)
    marketing.to_excel(writer, sheet_name="Marketing", index=False)

print(pd.ExcelFile(OUT + "/sales_marketing.xlsx").sheet_names)
print(sales.shape, marketing.shape)
```

```text
['Sales', 'Marketing']
(20, 5) (15, 5)
```

### Q26

**Q.** Export only Name and Balance columns to Excel.

**A.**

```python
df.to_excel(OUT + "/name_balance.xlsx", columns=["Name", "Balance"])
print(pd.read_excel(OUT + "/name_balance.xlsx", index_col=0).head(3))
```

```text
          Name    Balance
0  Aarav Mehta  140976.60
1    Diya Nair  474709.96
2   Kabir Shah  110395.82
```

`to_excel` still writes the index unless you add `index=False`.

### Q27

**Q.** Write the data beginning at row offset 2 and column offset 1.

**A.**

```python
from openpyxl import load_workbook

df.to_excel(OUT + "/offset.xlsx", startrow=2, startcol=1)
ws = load_workbook(OUT + "/offset.xlsx").active
print("A1:", ws["A1"].value, "| B3:", ws["B3"].value, "| C3:", ws["C3"].value)
```

```text
A1: None | B3: None | C3: Customer_ID
```

The header row lands in row 3 and the index in column B, so `Customer_ID` sits in C3 and everything above and left of B3 is empty.

### Q28

**Q.** Write the data with the first row frozen when the file is opened in Excel.

**A.**

```python
from openpyxl import load_workbook

df.to_excel(OUT + "/frozen.xlsx", index=False, freeze_panes=(1, 0))
print(load_workbook(OUT + "/frozen.xlsx").active.freeze_panes)
```

```text
A2
```

### Q29

**Q.** Write the data without column headers.

**A.**

```python
df.to_excel(OUT + "/no_header.xlsx", header=False, index=False)
print(pd.read_excel(OUT + "/no_header.xlsx", header=None).head(3))
```

```text
      0            1   2          3        4          5    6    7          8
0  C001  Aarav Mehta  53       Pune      SME  140976.60  550  Yes 2025-05-30
1  C002    Diya Nair  32  Hyderabad      SME  474709.96  546   No 2024-06-25
2  C003   Kabir Shah  52    Kolkata  Premium  110395.82  355  Yes 2024-06-02
```

### Q30

**Q.** Write the Missing_Data sheet and represent missing values as N/A.

**A.**

```python
from openpyxl import load_workbook

md = pd.read_excel(W, sheet_name="Missing_Data")
md.to_excel(OUT + "/missing_na_rep.xlsx", index=False, na_rep="N/A")
ws = load_workbook(OUT + "/missing_na_rep.xlsx").active
print(md.loc[1, "Age"], "->", repr(ws["C3"].value))
```

```text
nan -> 'N/A'
```

### Q31

**Q.** Write floating-point values with two decimal places.

**A.**

```python
df.to_excel(OUT + "/two_dp.xlsx", index=False, float_format="%.2f")

# Customer_Data's Balance already has 2 decimals, so the rounding only shows on longer floats:
demo = pd.DataFrame({"x": [1.23456, 2.5, 3.987654]})
demo.to_excel(OUT + "/two_dp_demo.xlsx", index=False, float_format="%.2f")
print(pd.read_excel(OUT + "/two_dp_demo.xlsx")["x"].tolist())
```

```text
[1.23, 2.5, 3.99]
```

### Q32

**Q.** Using ExcelWriter, write date and datetime columns with YYYY-MM-DD and YYYY-MM-DD HH:MM:SS formats. pandas reads both Order_Date and Order_Timestamp as datetime64 and `date_format` only applies to true date values, so convert the date column first. Run it once without the conversion to see that `date_format` is ignored.

**A.**

```python
from openpyxl import load_workbook

dates = pd.read_excel(W, sheet_name="Dates_Export")
dates["Order_Date"] = dates["Order_Date"].dt.date          # true dates, not datetimes

with pd.ExcelWriter(OUT + "/dates.xlsx",
                    date_format="YYYY-MM-DD",
                    datetime_format="YYYY-MM-DD HH:MM:SS") as writer:
    dates.to_excel(writer, sheet_name="Dates", index=False)

ws = load_workbook(OUT + "/dates.xlsx").active
print("Order_Date     :", ws["B2"].value, "|", ws["B2"].number_format)
print("Order_Timestamp:", ws["C2"].value, "|", ws["C2"].number_format)
```

```text
Order_Date     : 2026-01-08 00:00:00 | YYYY-MM-DD
Order_Timestamp: 2026-01-08 10:00:00 | YYYY-MM-DD HH:MM:SS
```

```python
# without the .dt.date conversion - date_format is ignored
raw = pd.read_excel(W, sheet_name="Dates_Export")
with pd.ExcelWriter(OUT + "/dates_raw.xlsx",
                    date_format="YYYY-MM-DD",
                    datetime_format="YYYY-MM-DD HH:MM:SS") as writer:
    raw.to_excel(writer, sheet_name="Dates", index=False)

ws = load_workbook(OUT + "/dates_raw.xlsx").active
print("Order_Date     :", ws["B2"].number_format)
```

```text
Order_Date     : YYYY-MM-DD HH:MM:SS
```

### Q33

**Q.** Display the first five rows and then the last five rows of Customer_Data.

**A.**

```python
print(df.head())
print(df.tail())
```

```text
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active  Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes 2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No 2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes 2024-06-02
3        C004   Meera Iyer   34  Bengaluru      SME   25706.89         392    Yes 2024-08-02
4        C005  Rohan Desai   30     Mumbai      SME  303206.73         726     No 2024-06-29
   Customer_ID           Name  Age       City  Segment    Balance  Risk_Score Active  Join_Date
25        C026   Leena Thomas   28        Goa      SME  636829.40         529     No 2024-12-06
26        C027   Omkar Sawant   52     Mumbai  Premium   39194.67         780     No 2025-04-29
27        C028   Kavya Pillai   31    Kolkata   Retail   35264.58         431    Yes 2024-08-01
28        C029  Harsh Agarwal   25        Goa   Retail  691394.29         820     No 2025-06-23
29        C030     Zoya Mirza   25  Hyderabad  Premium   35859.42         569    Yes 2025-01-20
```

### Q34

**Q.** Display general information and the data type of each column.

**A.**

```python
df.info()
print(df.dtypes)
```

```text
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 30 entries, 0 to 29
Data columns (total 9 columns):
 #   Column       Non-Null Count  Dtype         
---  ------       --------------  -----         
 0   Customer_ID  30 non-null     object        
 1   Name         30 non-null     object        
 2   Age          30 non-null     int64         
 3   City         30 non-null     object        
 4   Segment      30 non-null     object        
 5   Balance      30 non-null     float64       
 6   Risk_Score   30 non-null     int64         
 7   Active       30 non-null     object        
 8   Join_Date    30 non-null     datetime64[ns]
dtypes: datetime64[ns](1), float64(1), int64(2), object(5)
memory usage: 2.2+ KB
Customer_ID            object
Name                   object
Age                     int64
City                   object
Segment                object
Balance               float64
Risk_Score              int64
Active                 object
Join_Date      datetime64[ns]
dtype: object
```

### Q35

**Q.** Generate descriptive statistics. Note that in current pandas versions `describe()` also summarises the datetime column Join_Date alongside the numeric columns.

**A.**

```python
print(df.describe())
```

```text
             Age        Balance  Risk_Score            Join_Date
count  30.000000      30.000000   30.000000                   30
mean   39.033333  395335.506000  585.300000  2024-12-11 21:36:00
min    23.000000   25706.890000  327.000000  2024-01-20 00:00:00
25%    31.000000  111074.862500  433.750000  2024-07-05 12:00:00
50%    38.500000  411632.175000  583.500000  2024-12-12 12:00:00
75%    48.500000  633361.857500  740.250000  2025-05-22 06:00:00
max    58.000000  912373.950000  824.000000  2025-11-26 00:00:00
std    10.354021  300975.385757  165.463018                  NaN
```

### Q36

**Q.** Generate descriptive statistics with custom percentiles 0.30, 0.70 and 0.80.

**A.**

```python
print(df.describe(percentiles=[0.3, 0.7, 0.8]))
```

```text
             Age        Balance  Risk_Score            Join_Date
count  30.000000      30.000000   30.000000                   30
mean   39.033333  395335.506000  585.300000  2024-12-11 21:36:00
min    23.000000   25706.890000  327.000000  2024-01-20 00:00:00
30%    31.000000  132617.217000  463.000000  2024-07-29 21:36:00
50%    38.500000  411632.175000  583.500000  2024-12-12 12:00:00
70%    46.300000  608942.633000  726.900000  2025-04-27 14:24:00
80%    51.000000  674303.370000  756.200000  2025-07-01 14:24:00
max    58.000000  912373.950000  824.000000  2025-11-26 00:00:00
std    10.354021  300975.385757  165.463018                  NaN
```

### Q37

**Q.** Display the DataFrame shape and the column names.

**A.**

```python
print(df.shape)
print(df.columns.tolist())
```

```text
(30, 9)
['Customer_ID', 'Name', 'Age', 'City', 'Segment', 'Balance', 'Risk_Score', 'Active', 'Join_Date']
```

### Q38

**Q.** Select the Name column as a single Series.

**A.**

```python
print(df["Name"].head())
print(type(df["Name"]))
```

```text
0    Aarav Mehta
1      Diya Nair
2     Kabir Shah
3     Meera Iyer
4    Rohan Desai
Name: Name, dtype: object
<class 'pandas.core.series.Series'>
```

### Q39

**Q.** Select Name and Age together as a DataFrame.

**A.**

```python
print(df[["Name", "Age"]].head())
```

```text
          Name  Age
0  Aarav Mehta   53
1    Diya Nair   32
2   Kabir Shah   52
3   Meera Iyer   34
4  Rohan Desai   30
```

### Q40

**Q.** Filter customers whose Age is greater than 30.

**A.**

```python
print(df[df["Age"] > 30].shape)
print(df[df["Age"] > 30].head())
```

```text
(23, 9)
  Customer_ID         Name  Age       City  Segment    Balance  Risk_Score Active  Join_Date
0        C001  Aarav Mehta   53       Pune      SME  140976.60         550    Yes 2025-05-30
1        C002    Diya Nair   32  Hyderabad      SME  474709.96         546     No 2024-06-25
2        C003   Kabir Shah   52    Kolkata  Premium  110395.82         355    Yes 2024-06-02
3        C004   Meera Iyer   34  Bengaluru      SME   25706.89         392    Yes 2024-08-02
5        C006   Ananya Rao   38      Delhi  Premium   64403.42         629    Yes 2025-02-23
```

### Q41

**Q.** Filter customers whose Age is greater than 25 AND City is Goa.

**A.**

```python
print(df[(df["Age"] > 25) & (df["City"] == "Goa")])
```

```text
   Customer_ID            Name  Age City  Segment    Balance  Risk_Score Active  Join_Date
9         C010  Nisha Kulkarni   39  Goa  Premium  543586.83         744    Yes 2025-11-26
20        C021    Varun Shetty   51  Goa      SME  912373.95         338    Yes 2024-04-17
25        C026    Leena Thomas   28  Goa      SME  636829.40         529     No 2024-12-06
```

### Q42

**Q.** Filter customers who are either in Goa OR Mumbai.

**A.**

```python
print(df[(df["City"] == "Goa") | (df["City"] == "Mumbai")])
```

```text
   Customer_ID            Name  Age    City  Segment    Balance  Risk_Score Active  Join_Date
4         C005     Rohan Desai   30  Mumbai      SME  303206.73         726     No 2024-06-29
6         C007    Arjun Kapoor   23     Goa      SME  757356.26         729    Yes 2025-01-19
9         C010  Nisha Kulkarni   39     Goa  Premium  543586.83         744    Yes 2025-11-26
10        C011      Rahul Naik   46  Mumbai  Premium  255878.95         753    Yes 2024-08-06
14        C015    Aditya Verma   55  Mumbai      SME  622959.23         659     No 2025-08-17
20        C021    Varun Shetty   51     Goa      SME  912373.95         338    Yes 2024-04-17
25        C026    Leena Thomas   28     Goa      SME  636829.40         529     No 2024-12-06
26        C027    Omkar Sawant   52  Mumbai  Premium   39194.67         780     No 2025-04-29
28        C029   Harsh Agarwal   25     Goa   Retail  691394.29         820     No 2025-06-23
```

### Q43

**Q.** Filter customers who are NOT in the Retail segment.

**A.**

```python
print(df[~(df["Segment"] == "Retail")].shape)
print(df[~(df["Segment"] == "Retail")]["Segment"].value_counts())
```

```text
(24, 9)
Segment
SME        13
Premium    11
Name: count, dtype: int64
```

### Q44

**Q.** Read Scores_Axis, keep Student as the row label, and calculate column totals for Math, Science and English. Setting `index_col=0` matters here: without it the Student text column is included in the operation.

**A.**

```python
scores = pd.read_excel(W, sheet_name="Scores_Axis", index_col=0)
print(scores.sum(axis=0))
```

```text
Math       717
Science    627
English    658
dtype: int64
```

Without `index_col=0` the Student column is object dtype and `sum(axis=0)` concatenates it into `S1S2S3...` on top of the three numeric totals.

### Q45

**Q.** Calculate each student's total across Math, Science and English.

**A.**

```python
print(scores.sum(axis=1))
```

```text
Student
S1    194
S2    239
S3    238
S4    203
S5    239
S6    207
S7    244
S8    229
S9    209
dtype: int64
```

### Q46

**Q.** Drop the Salary column from Sorting_Data and modify the DataFrame itself. Confirm that the method returns None when `inplace=True`.

**A.**

```python
sd = pd.read_excel(W, sheet_name="Sorting_Data")
print("before:", sd.columns.tolist())
print("returns:", sd.drop("Salary", axis=1, inplace=True))
print("after :", sd.columns.tolist())
```

```text
before: ['Employee_ID', 'Name', 'Department', 'Age', 'Score', 'Salary']
returns: None
after : ['Employee_ID', 'Name', 'Department', 'Age', 'Score']
```

### Q47

**Q.** Fill missing Score values in Missing_Data with 0 and modify the DataFrame itself, using the dictionary form of `fillna` on the whole DataFrame. Also try `df["Score"].fillna(0, inplace=True)` and observe that it does NOT work.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
print("before:", md["Score"].isna().sum())
md.fillna({"Score": 0}, inplace=True)
print("after :", md["Score"].isna().sum())
```

```text
before: 5
after : 0
```

```python
# the chained-assignment form the exercise tells you to try
md2 = pd.read_excel(W, sheet_name="Missing_Data")
print("before:", md2["Score"].isna().sum())
md2["Score"].fillna(0, inplace=True)
print("after :", md2["Score"].isna().sum())
```

```text
before: 5
FutureWarning: A value is trying to be set on a copy of a DataFrame or Series through chained assignment using an inplace method.
The behavior will change in pandas 3.0. This inplace method will never work because the intermediate object on which we are setting values always behaves as a copy.

For example, when doing 'df[col].method(value, inplace=True)', try using 'df.method({col: value}, inplace=True)' or df[col] = df[col].method(value) instead, to perform the operation inplace on the original object.

after : 0
```

`md2["Score"]` is an intermediate object, so the in-place write may be thrown away: pandas 2.x warns (the value happens to land), and from pandas 3.0 the same line raises `ChainedAssignmentError` and leaves the frame unchanged. Use the dict form, or `md["Score"] = md["Score"].fillna(0)`.

### Q48

**Q.** Drop rows that contain missing values and modify the DataFrame itself.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
print("before:", md.shape)
md.dropna(inplace=True)
print("after :", md.shape)
```

```text
before: (22, 7)
after : (9, 7)
```

### Q49

**Q.** Replace the text Pending with Review and modify the DataFrame itself.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
md.replace("Pending", "Review", inplace=True)
print(md["Status"].value_counts(dropna=False))
```

```text
Status
Inactive    11
Review       5
Active       5
NaN          1
Name: count, dtype: int64
```

### Q50

**Q.** Sort Sorting_Data by Age in place.

**A.**

```python
sd = pd.read_excel(W, sheet_name="Sorting_Data")
sd.sort_values(by="Age", inplace=True)
print(sd.head())
```

```text
   Employee_ID          Name  Department  Age  Score  Salary
4         E005    Tanvi Bhat   Marketing   24     90  108389
8         E009   Aditi Sinha   Marketing   26     72   99951
10        E011    Neha Reddy  Operations   26     90  102251
14        E015  Leena Thomas   Marketing   28     84   95958
15        E016  Omkar Sawant   Analytics   28     90   46307
```

### Q51

**Q.** Set Student_ID as the index of Indexed_Data in place, then sort the index in place.

**A.**

```python
idx = pd.read_excel(W, sheet_name="Indexed_Data")
idx.set_index("Student_ID", inplace=True)
idx.sort_index(inplace=True)
print(idx.head())
```

```text
                      Name  Age       City  Score
Student_ID                                       
ST101           Ananya Rao   22     Mumbai     71
ST102         Arjun Kapoor   34  Bengaluru     80
ST103           Ishita Sen   33       Pune     90
ST104         Vikram Joshi   26       Pune     95
ST105       Nisha Kulkarni   32        Goa     83
```

### Q52

**Q.** After Q51, reset the index in place.

**A.**

```python
idx.reset_index(inplace=True)
print(idx.head())
```

```text
  Student_ID            Name  Age       City  Score
0      ST101      Ananya Rao   22     Mumbai     71
1      ST102    Arjun Kapoor   34  Bengaluru     80
2      ST103      Ishita Sen   33       Pune     90
3      ST104    Vikram Joshi   26       Pune     95
4      ST105  Nisha Kulkarni   32        Goa     83
```

### Q53

**Q.** Remove duplicate rows in place. The sheet contains two deliberate duplicates at the bottom.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
print("before:", md.shape)
md.drop_duplicates(inplace=True)
print("after :", md.shape)
```

```text
before: (22, 7)
after : (20, 7)
```

### Q54

**Q.** The slides note that newer pandas versions do not support `inplace` for `astype`. Convert Risk_Score to float using `astype` and assign the result back to the column.

**A.**

```python
print("before:", df["Risk_Score"].dtype)
df["Risk_Score"] = df["Risk_Score"].astype(float)
print("after :", df["Risk_Score"].dtype)
print(df[["Customer_ID", "Risk_Score"]].head(3))
```

```text
before: int64
after : float64
  Customer_ID  Risk_Score
0        C001       550.0
1        C002       546.0
2        C003       355.0
```

```python
df["Risk_Score"].astype(float, inplace=True)
```

```text
TypeError: astype() got an unexpected keyword argument 'inplace'
```

### Q55

**Q.** Display a Boolean mask of Missing_Data using both missing-value aliases, then count missing values in each column.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
print(md.isna().head())
print(md.isnull().equals(md.isna()))
print(md.isna().sum())
```

```text
   Record_ID   Name    Age  Score  Income   City  Status
0      False  False  False  False   False  False   False
1      False  False   True  False   False  False   False
2      False  False  False  False   False  False   False
3      False  False  False   True   False  False   False
4      False  False  False  False   False  False   False
True
Record_ID    0
Name         0
Age          3
Score        5
Income       2
City         2
Status       1
dtype: int64
```

### Q56

**Q.** Use `info()` to compare non-null counts with Q55.

**A.**

```python
md.info()
```

```text
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 22 entries, 0 to 21
Data columns (total 7 columns):
 #   Column     Non-Null Count  Dtype  
---  ------     --------------  -----  
 0   Record_ID  22 non-null     object 
 1   Name       22 non-null     object 
 2   Age        19 non-null     float64
 3   Score      17 non-null     float64
 4   Income     20 non-null     float64
 5   City       20 non-null     object 
 6   Status     21 non-null     object 
dtypes: float64(3), object(4)
memory usage: 1.3+ KB
```

22 entries, so Age 19 non-null = 3 missing, Score 17 = 5 missing, Income 20 = 2, City 20 = 2, Status 21 = 1.

### Q57

**Q.** Read Missing_Tokens and use `isna().sum()` plus `info()` to observe which text tokens are recognized as missing in your pandas version. Pay attention to the Age column: lowercase `na` is NOT in the default missing-value list, even though `n/a` and `NA` are.

**A.**

```python
raw = pd.read_excel(W, sheet_name="Missing_Tokens")
print(raw.isna().sum())
print(raw["Age"].unique())
raw.info()
```

```text
Age            0
Own_house      0
Family_size    3
Children       1
Income_2020    4
Income_2021    4
dtype: int64
[62 63 '-' 64 48 49 '@@' 55 61 '#' 65 'na' 'nAN']
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 15 entries, 0 to 14
Data columns (total 6 columns):
 #   Column       Non-Null Count  Dtype  
---  ------       --------------  -----  
 0   Age          15 non-null     object 
 1   Own_house    15 non-null     object 
 2   Family_size  12 non-null     float64
 3   Children     14 non-null     float64
 4   Income_2020  11 non-null     object 
 5   Income_2021  11 non-null     object 
dtypes: float64(2), object(4)
memory usage: 848.0+ bytes
```

Age reports 0 missing and stays `object`, because `-`, `@@`, `#`, `na` and `nAN` are all still strings.

### Q58

**Q.** Re-read the same sheet, this time telling pandas to also treat the unrecognized tokens as missing. Compare the non-null counts with Q57.

**A.**

```python
clean = pd.read_excel(W, sheet_name="Missing_Tokens",
                      na_values=["-", "@@", "#", "?", "nuLL", "nAN", "###", "na"])
print(clean.isna().sum())
clean.info()
```

```text
Age            5
Own_house      2
Family_size    3
Children       1
Income_2020    5
Income_2021    5
dtype: int64
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 15 entries, 0 to 14
Data columns (total 6 columns):
 #   Column       Non-Null Count  Dtype  
---  ------       --------------  -----  
 0   Age          10 non-null     float64
 1   Own_house    13 non-null     float64
 2   Family_size  12 non-null     float64
 3   Children     14 non-null     float64
 4   Income_2020  10 non-null     float64
 5   Income_2021  10 non-null     float64
dtypes: float64(6)
memory usage: 848.0 bytes
```

Age goes 0 -> 5 missing and every column is now float64.

### Q59

**Q.** Create a new DataFrame with every row containing any missing value removed.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
clean_rows = md.dropna()
print(md.shape, "->", clean_rows.shape)
```

```text
(22, 7) -> (9, 7)
```

### Q60

**Q.** Drop rows only when Age is missing; keep rows with missing values elsewhere.

**A.**

```python
age_ok = md.dropna(subset=["Age"])
print(md.shape, "->", age_ok.shape)
print(age_ok.isna().sum())
```

```text
(22, 7) -> (19, 7)
Record_ID    0
Name         0
Age          0
Score        5
Income       2
City         2
Status       1
dtype: int64
```

### Q61

**Q.** Replace every missing value with 0 in a returned copy; do not modify the original DataFrame.

**A.**

```python
filled = md.fillna(0)
print(filled.isna().sum().sum(), md.isna().sum().sum())
print(filled.head(3))
```

```text
0 13
  Record_ID         Name   Age  Score     Income       City    Status
0      R001  Aarav Mehta  54.0   79.0   65833.65  Hyderabad  Inactive
1      R002    Diya Nair   0.0   87.0   80027.09  Bengaluru   Pending
2      R003   Kabir Shah  24.0   59.0  124850.58     Mumbai  Inactive
```

### Q62

**Q.** Replace missing Age values with the mean of the Age column and assign the result back to the column. Do not use `inplace` on the Series - that is chained assignment.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
md["Age"] = md["Age"].fillna(md["Age"].mean())
print(md["Age"].isna().sum())
print(md["Age"].head(3).round(4).tolist())
```

```text
0
[54.0, 37.4211, 24.0]
```

### Q63

**Q.** In one call, fill missing Age with the Age mean and missing Score with 0, modifying the DataFrame itself.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
md.fillna({"Age": md["Age"].mean(), "Score": 0}, inplace=True)
print(md.isna().sum())
```

```text
Record_ID    0
Name         0
Age          0
Score        0
Income       2
City         2
Status       1
dtype: int64
```

### Q64

**Q.** Re-read the sheet, then forward-fill missing values. Use `df.ffill()`: the older `fillna(method="ffill")` form is deprecated and has been removed in pandas 3.x.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
ff = md.ffill()
print(ff.isna().sum())
print(ff.head(3))
```

```text
Record_ID    0
Name         0
Age          0
Score        0
Income       0
City         0
Status       0
dtype: int64
  Record_ID         Name   Age  Score     Income       City    Status
0      R001  Aarav Mehta  54.0   79.0   65833.65  Hyderabad  Inactive
1      R002    Diya Nair  54.0   87.0   80027.09  Bengaluru   Pending
2      R003   Kabir Shah  24.0   59.0  124850.58     Mumbai  Inactive
```

### Q65

**Q.** Re-read the sheet, then backward-fill missing values.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
bf = md.bfill()
print(bf.isna().sum())
print(bf.head(3))
```

```text
Record_ID    0
Name         0
Age          0
Score        1
Income       0
City         0
Status       0
dtype: int64
  Record_ID         Name   Age  Score     Income       City    Status
0      R001  Aarav Mehta  54.0   79.0   65833.65  Hyderabad  Inactive
1      R002    Diya Nair  24.0   87.0   80027.09  Bengaluru   Pending
2      R003   Kabir Shah  24.0   59.0  124850.58     Mumbai  Inactive
```

### Q66

**Q.** The Score column contains three consecutive missing values. Forward-fill with `limit=1` and compare the result and the missing counts with an unlimited `ffill()`.

**A.**

```python
md = pd.read_excel(W, sheet_name="Missing_Data")
print(pd.DataFrame({"Score": md["Score"],
                    "ffill": md["Score"].ffill(),
                    "ffill_limit1": md["Score"].ffill(limit=1)}).loc[9:13])
print("limit=1 :", md.ffill(limit=1)["Score"].isna().sum())
print("unlimited:", md.ffill()["Score"].isna().sum())
```

```text
    Score  ffill  ffill_limit1
9    70.0   70.0          70.0
10    NaN   70.0          70.0
11    NaN   70.0           NaN
12    NaN   70.0           NaN
13   55.0   55.0          55.0
limit=1 : 2
unlimited: 0
```

### Q67

**Q.** Set Student_ID as the index of Indexed_Data. Select the row with label ST101 using `loc`. Keep this indexed DataFrame for Q68 to Q72.

**A.**

```python
sid = pd.read_excel(W, sheet_name="Indexed_Data").set_index("Student_ID")
print(sid.loc["ST101"])
```

```text
Name     Ananya Rao
Age              22
City         Mumbai
Score            71
Name: ST101, dtype: object
```

### Q68

**Q.** On the same indexed DataFrame, select the first row by position using `iloc`.

**A.**

```python
print(sid.iloc[0])
```

```text
Name     Ananya Rao
Age              22
City         Mumbai
Score            71
Name: ST101, dtype: object
```

### Q69

**Q.** Select the Name value for student ST103 using `loc`.

**A.**

```python
print(sid.loc["ST103", "Name"])
```

```text
Ishita Sen
```

### Q70

**Q.** Select the value in the first row and first data column using `iloc`. With Student_ID as the index the first data column is Name, so the answer should be a student name, not an ID.

**A.**

```python
print(sid.iloc[0, 0])
```

```text
Ananya Rao
```

### Q71

**Q.** Using labels, slice rows ST103 through ST107 and columns Name through City. Confirm stop labels are included.

**A.**

```python
print(sid.loc["ST103":"ST107", "Name":"City"])
```

```text
                      Name  Age       City
Student_ID                                
ST103           Ishita Sen   33       Pune
ST104         Vikram Joshi   26       Pune
ST105       Nisha Kulkarni   32        Goa
ST106           Rahul Naik   21  Bengaluru
ST107          Sneha Patil   21  Bengaluru
```

Five rows (ST103-ST107) and three columns (Name, Age, City) - `loc` includes both stop labels.

### Q72

**Q.** Using positions, slice row positions 2 through 6 and column positions 0 through 2. Confirm stop positions are excluded.

**A.**

```python
print(sid.iloc[2:7, 0:3])
```

```text
                      Name  Age       City
Student_ID                                
ST103           Ishita Sen   33       Pune
ST104         Vikram Joshi   26       Pune
ST105       Nisha Kulkarni   32        Goa
ST106           Rahul Naik   21  Bengaluru
ST107          Sneha Patil   21  Bengaluru
```

Positions 2-6 and columns 0-2: `iloc` excludes the stop, so `2:7` is five rows and `0:3` is three columns.

### Q73

**Q.** Sort Sorting_Data by Age in ascending order and store the result in a new DataFrame.

**A.**

```python
sd = pd.read_excel(W, sheet_name="Sorting_Data")
by_age = sd.sort_values(by="Age", ascending=True)
print(by_age)
```

```text
   Employee_ID            Name  Department  Age  Score  Salary
4         E005      Tanvi Bhat   Marketing   24     90  108389
8         E009     Aditi Sinha   Marketing   26     72   99951
10        E011      Neha Reddy  Operations   26     90  102251
14        E015    Leena Thomas   Marketing   28     84   95958
15        E016    Omkar Sawant   Analytics   28     90   46307
16        E017    Kavya Pillai   Marketing   28     72   60884
3         E004    Aditya Verma   Marketing   28     72  119379
5         E006     Sameer Khan  Operations   28     78  113263
9         E010    Varun Shetty   Marketing   30     90  111291
2         E003     Pooja Menon   Analytics   30     78  101080
11        E012     Sahil Gupta   Marketing   30     90   45204
13        E014       Dev Patel     Finance   30     95   86092
0         E001     Sneha Patil   Marketing   30     78   74966
6         E007       Riya Bose   Analytics   34     78  108202
7         E008     Nikhil Jain   Marketing   34     95  119657
12        E013  Maya Fernandes  Operations   34     78  112820
1         E002  Karan Malhotra     Finance   34     84   74361
```

### Q74

**Q.** Sort first by Age ascending and then Score descending. The sheet contains several employees of the same age so the second key visibly changes the order.

**A.**

```python
print(sd.sort_values(by=["Age", "Score"], ascending=[True, False]))
```

```text
   Employee_ID            Name  Department  Age  Score  Salary
4         E005      Tanvi Bhat   Marketing   24     90  108389
10        E011      Neha Reddy  Operations   26     90  102251
8         E009     Aditi Sinha   Marketing   26     72   99951
15        E016    Omkar Sawant   Analytics   28     90   46307
14        E015    Leena Thomas   Marketing   28     84   95958
5         E006     Sameer Khan  Operations   28     78  113263
3         E004    Aditya Verma   Marketing   28     72  119379
16        E017    Kavya Pillai   Marketing   28     72   60884
13        E014       Dev Patel     Finance   30     95   86092
9         E010    Varun Shetty   Marketing   30     90  111291
11        E012     Sahil Gupta   Marketing   30     90   45204
0         E001     Sneha Patil   Marketing   30     78   74966
2         E003     Pooja Menon   Analytics   30     78  101080
7         E008     Nikhil Jain   Marketing   34     95  119657
1         E002  Karan Malhotra     Finance   34     84   74361
6         E007       Riya Bose   Analytics   34     78  108202
12        E013  Maya Fernandes  Operations   34     78  112820
```

### Q75

**Q.** Select only row positions 1 and 2.

**A.**

```python
print(sd.iloc[1:3])
```

```text
  Employee_ID            Name Department  Age  Score  Salary
1        E002  Karan Malhotra    Finance   34     84   74361
2        E003     Pooja Menon  Analytics   30     78  101080
```

### Q76

**Q.** Select only column positions 1 and 2 for all rows.

**A.**

```python
print(sd.iloc[:, 1:3].head())
```

```text
             Name Department
0     Sneha Patil  Marketing
1  Karan Malhotra    Finance
2     Pooja Menon  Analytics
3    Aditya Verma  Marketing
4      Tanvi Bhat  Marketing
```

### Q77

**Q.** Select row positions 1 and 2 and column positions 0 and 1.

**A.**

```python
print(sd.iloc[1:3, 0:2])
```

```text
  Employee_ID            Name
1        E002  Karan Malhotra
2        E003     Pooja Menon
```

### Q78

**Q.** Re-read the sheet, set Employee_ID as the index, then select rows E002 through E005 by label. Keep this indexed DataFrame for Q79 and Q80.

**A.**

```python
eid = pd.read_excel(W, sheet_name="Sorting_Data").set_index("Employee_ID")
print(eid.loc["E002":"E005"])
```

```text
                       Name Department  Age  Score  Salary
Employee_ID                                               
E002         Karan Malhotra    Finance   34     84   74361
E003            Pooja Menon  Analytics   30     78  101080
E004           Aditya Verma  Marketing   28     72  119379
E005             Tanvi Bhat  Marketing   24     90  108389
```

### Q79

**Q.** Select all rows and columns Name through Score using `loc`.

**A.**

```python
print(eid.loc[:, "Name":"Score"].head())
```

```text
                       Name Department  Age  Score
Employee_ID                                       
E001            Sneha Patil  Marketing   30     78
E002         Karan Malhotra    Finance   34     84
E003            Pooja Menon  Analytics   30     78
E004           Aditya Verma  Marketing   28     72
E005             Tanvi Bhat  Marketing   24     90
```

### Q80

**Q.** Select rows E002 through E005 and columns Name through Age using `loc`.

**A.**

```python
print(eid.loc["E002":"E005", "Name":"Age"])
```

```text
                       Name Department  Age
Employee_ID                                
E002         Karan Malhotra    Finance   34
E003            Pooja Menon  Analytics   30
E004           Aditya Verma  Marketing   28
E005             Tanvi Bhat  Marketing   24
```

### Q81

**Q.** Create a pivot table with Region as rows, Product as columns, Units as values, sum aggregation, and 0 for empty cells. Run it once without `fill_value`: the North / Product B combination does not occur in the data, so that cell is NaN until you fill it.

**A.**

```python
sp = pd.read_excel(W, sheet_name="Sales_Pivot")
print(sp.pivot_table(index="Region", columns="Product", values="Units", aggfunc="sum"))
```

```text
Product     A     B     C
Region                   
East     90.0  32.0  72.0
North    57.0   NaN  54.0
South    91.0  75.0  46.0
West     64.0  43.0  79.0
```

```python
print(sp.pivot_table(index="Region", columns="Product", values="Units",
                     aggfunc="sum", fill_value=0))
```

```text
Product   A   B   C
Region             
East     90  32  72
North    57   0  54
South    91  75  46
West     64  43  79
```

### Q82

**Q.** Repeat Q81 and add row/column totals labelled Total.

**A.**

```python
print(sp.pivot_table(index="Region", columns="Product", values="Units",
                     aggfunc="sum", fill_value=0,
                     margins=True, margins_name="Total"))
```

```text
Product    A    B    C  Total
Region                       
East      90   32   72    194
North     57    0   54    111
South     91   75   46    212
West      64   43   79    186
Total    302  150  251    703
```

Margins are computed from the raw rows, not by adding up the displayed cells.

### Q83

**Q.** Create a pivot table of Revenue using both sum and mean aggregations.

**A.**

```python
pt = sp.pivot_table(index="Region", columns="Product", values="Revenue",
                    aggfunc=["sum", "mean"])
print(pt.round(2))
print(pt.columns)
```

```text
             sum                     mean                  
Product        A       B       C        A        B        C
Region                                                     
East     11710.0  4280.0  8450.0  1301.11  1070.00  1207.14
North     8550.0     NaN  5300.0  2137.50      NaN   883.33
South     9960.0  7760.0  4350.0  1245.00  1108.57   870.00
West      7700.0  4620.0  8070.0  1100.00  1540.00   896.67
MultiIndex([( 'sum', 'A'),
            ( 'sum', 'B'),
            ( 'sum', 'C'),
            ('mean', 'A'),
            ('mean', 'B'),
            ('mean', 'C')],
           names=[None, 'Product'])
```

### Q84

**Q.** Flatten the MultiIndex columns from Q83 using the f-string pattern shown in the slides.

**A.**

```python
pt.columns = [f"{agg}_{col}" for agg, col in pt.columns]
print(pt.round(2))
```

```text
          sum_A   sum_B   sum_C   mean_A   mean_B   mean_C
Region                                                    
East    11710.0  4280.0  8450.0  1301.11  1070.00  1207.14
North    8550.0     NaN  5300.0  2137.50      NaN   883.33
South    9960.0  7760.0  4350.0  1245.00  1108.57   870.00
West     7700.0  4620.0  8070.0  1100.00  1540.00   896.67
```

### Q85

**Q.** Reset the index so Region becomes a normal column again.

**A.**

```python
print(pt.reset_index().round(2))
```

```text
  Region    sum_A   sum_B   sum_C   mean_A   mean_B   mean_C
0   East  11710.0  4280.0  8450.0  1301.11  1070.00  1207.14
1  North   8550.0     NaN  5300.0  2137.50      NaN   883.33
2  South   9960.0  7760.0  4350.0  1245.00  1108.57   870.00
3   West   7700.0  4620.0  8070.0  1100.00  1540.00   896.67
```

### Q86

**Q.** Create one pivot table that aggregates both Units and Revenue by Region x Product using sum.

**A.**

```python
pt2 = sp.pivot_table(index="Region", columns="Product",
                     values=["Units", "Revenue"], aggfunc="sum", fill_value=0)
print(pt2)
print(pt2.columns)
```

```text
        Revenue             Units        
Product       A     B     C     A   B   C
Region                                   
East      11710  4280  8450    90  32  72
North      8550     0  5300    57   0  54
South      9960  7760  4350    91  75  46
West       7700  4620  8070    64  43  79
MultiIndex([('Revenue', 'A'),
            ('Revenue', 'B'),
            ('Revenue', 'C'),
            (  'Units', 'A'),
            (  'Units', 'B'),
            (  'Units', 'C')],
           names=[None, 'Product'])
```

Revenue comes first: the value level is sorted, not taken in the order you listed.

### Q87

**Q.** Flatten the columns from Q86 using the value_product naming pattern shown in the slides.

**A.**

```python
pt2.columns = [f"{val}_{col}" for val, col in pt2.columns]
print(pt2)
```

```text
        Revenue_A  Revenue_B  Revenue_C  Units_A  Units_B  Units_C
Region                                                            
East        11710       4280       8450       90       32       72
North        8550          0       5300       57        0       54
South        9960       7760       4350       91       75       46
West         7700       4620       8070       64       43       79
```

### Q88

**Q.** Use count as the aggregation instead of sum. Then try min and max in separate runs.

**A.**

```python
print(sp.pivot_table(index="Region", columns="Product", values="Units",
                     aggfunc="count", fill_value=0))
print(sp.pivot_table(index="Region", columns="Product", values="Units", aggfunc="min"))
print(sp.pivot_table(index="Region", columns="Product", values="Units", aggfunc="max"))
```

```text
Product  A  B  C
Region          
East     9  4  7
North    4  0  6
South    8  7  5
West     7  3  9
Product     A    B    C
Region                 
East      3.0  1.0  1.0
North    10.0  NaN  3.0
South     5.0  1.0  3.0
West      2.0  9.0  1.0
Product     A     B     C
Region                   
East     17.0  16.0  20.0
North    17.0   NaN  16.0
South    19.0  18.0  18.0
West     18.0  18.0  17.0
```

`min`/`max` over the empty North x B group is NaN, which turns the whole block float64.

### Q89

**Q.** Create the Region x Product pivot once with `sort=True` and once with `sort=False`. Compare label order: `sort=False` returns the regions in order of first appearance in the data.

**A.**

```python
print(sp.pivot_table(index="Region", columns="Product", values="Units",
                     aggfunc="sum", fill_value=0, sort=True))
print(sp.pivot_table(index="Region", columns="Product", values="Units",
                     aggfunc="sum", fill_value=0, sort=False))
print(sp["Region"].drop_duplicates().tolist())
print(sp["Product"].drop_duplicates().tolist())
```

```text
Product   A   B   C
Region             
East     90  32  72
North    57   0  54
South    91  75  46
West     64  43  79
Product   C   A   B
Region             
East     72  90  32
West     79  64  43
South    46  91  75
North    54  57   0
['East', 'West', 'South', 'North']
['C', 'A', 'B']
```

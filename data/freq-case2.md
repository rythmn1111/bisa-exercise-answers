---
id: freq-case2
title: "Frequency Distribution — Case 2: Credit Card Customer Spending"
source: "Frequency distribution/Practice exercises/Case 2/Exercise 2.pdf"
datafile: "Frequency distribution/Practice exercises/Case 2/exercise_2_credit_card_spending.xlsx"
topic: "Frequency tables with value_counts, class intervals with pd.cut, cross-tabulation"
group: "Frequency distribution"
order: 82
setup: |
  import pandas as pd
  df = pd.read_excel("exercise_2_credit_card_spending.xlsx", sheet_name="Credit_Card_Data")
---

### Q1

**Q.** Find the frequency of each `Card_Type`.

**A.**

```python
card_freq = df["Card_Type"].value_counts()
print(card_freq)
```

```text
Card_Type
Gold        16
Silver      14
Platinum    10
Name: count, dtype: int64
```

### Q2

**Q.** Find the number of customers in each `Customer_Segment`.

**A.**

```python
segment_freq = df["Customer_Segment"].value_counts()
print(segment_freq)
```

```text
Customer_Segment
Salaried    16
Business    15
Student      9
Name: count, dtype: int64
```

### Q3

**Q.** Find the frequency of each `Payment_Status`.

**A.**

```python
payment_freq = df["Payment_Status"].value_counts()
print(payment_freq)
```

```text
Payment_Status
On Time    25
Late       15
Name: count, dtype: int64
```

### Q4

**Q.** Create a grouped frequency distribution for `Monthly_Spend` using the intervals ₹0–20,000, ₹20,000–40,000, ₹40,000–60,000, ₹60,000–80,000, ₹80,000–1,00,000.

**A.**

```python
bins = [0, 20000, 40000, 60000, 80000, 100000]
df["Spend_Group"] = pd.cut(df["Monthly_Spend"], bins=bins, right=False)
spend_freq = df["Spend_Group"].value_counts().sort_index()
print(spend_freq)
```

```text
Spend_Group
[0, 20000)         11
[20000, 40000)     13
[40000, 60000)      6
[60000, 80000)      7
[80000, 100000)     3
Name: count, dtype: int64
```

`right=False` makes every class left-closed, `[lower, upper)` — the paper never states the convention, and this is the one the course's own notebook uses. Here it changes nothing: no `Monthly_Spend` value falls exactly on a class edge, so `right=True` gives the identical table.

### Q5

**Q.** Convert the grouped frequency distribution into a DataFrame containing Monthly Spend Group, Frequency, Percentage and Cumulative Frequency.

**A.**

```python
freq_table = spend_freq.reset_index()
freq_table.columns = ["Monthly Spend Group", "Frequency"]
freq_table["Percentage"] = (freq_table["Frequency"] / freq_table["Frequency"].sum() * 100).round(2)
freq_table["Cumulative_Frequency"] = freq_table["Frequency"].cumsum()
print(freq_table)
```

```text
  Monthly Spend Group  Frequency  Percentage  Cumulative_Frequency
0          [0, 20000)         11        27.5                    11
1      [20000, 40000)         13        32.5                    24
2      [40000, 60000)          6        15.0                    30
3      [60000, 80000)          7        17.5                    37
4     [80000, 100000)          3         7.5                    40
```

Rename by position — the names `value_counts().reset_index()` produces differ across pandas versions.

### Q6

**Q.** Find the count, mean, median, minimum, maximum and standard deviation of `Monthly_Spend`.

**A.**

```python
print(df["Monthly_Spend"].agg(["count", "mean", "median", "min", "max", "std"]))
```

```text
count        40.000000
mean      39350.000000
median    33500.000000
min        8000.000000
max       88000.000000
std       24556.110525
Name: Monthly_Spend, dtype: float64
```

`std()` is the sample standard deviation (`ddof=1`).

### Q7

**Q.** Create a cross-tabulation between `Card_Type` and `Payment_Status`.

**A.**

```python
card_payment = pd.crosstab(df["Card_Type"], df["Payment_Status"])
print(card_payment)
```

```text
Payment_Status  Late  On Time
Card_Type                    
Gold               2       14
Platinum           4        6
Silver             9        5
```

### Q8

**Q.** Create a cross-tabulation between `Customer_Segment` and `Payment_Status`.

**A.**

```python
segment_payment = pd.crosstab(df["Customer_Segment"], df["Payment_Status"])
print(segment_payment)
```

```text
Payment_Status    Late  On Time
Customer_Segment               
Business             5       10
Salaried             2       14
Student              8        1
```

### Q9

**Q.** Identify the most common card type, the most common customer segment, the most common payment status, and the monthly spending interval having the highest frequency.

**A.**

```python
print("Most common Card_Type        :", df["Card_Type"].mode().tolist())
print("Most common Customer_Segment :", df["Customer_Segment"].mode().tolist())
print("Most common Payment_Status   :", df["Payment_Status"].mode().tolist())
print("Modal Monthly_Spend class    :", df["Spend_Group"].mode().astype(str).tolist())
```

```text
Most common Card_Type        : ['Gold']
Most common Customer_Segment : ['Salaried']
Most common Payment_Status   : ['On Time']
Modal Monthly_Spend class    : ['[20000, 40000)']
```

`.mode()` is used instead of `value_counts().idxmax()` because `idxmax()` reports only the first of any tied categories; nothing is tied here, so both give the same answer.

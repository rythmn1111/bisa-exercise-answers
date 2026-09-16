---
id: combine
title: "Concat, Merge & Join — Exercises 1–10"
source: "Concat merge join exercises/pandas_concat_merge_join_practice_datasets.xlsx (sheet `Exercises`)"
datafile: "Concat merge join exercises/pandas_concat_merge_join_practice_datasets.xlsx"
topic: "concat axis=0/axis=1, merge how= and key names, index joins, many-to-many"
group: "Concat merge join"
order: 70
setup: |
  import pandas as pd
  pd.set_option("display.width", 200)
  pd.set_option("display.max_columns", 50)

  W = "pandas_concat_merge_join_practice_datasets.xlsx"
  rd = lambda s: pd.read_excel(W, sheet_name=s)

  # The questions themselves live in the workbook, not in a PDF:
  #   ex = pd.read_excel(W, sheet_name="Exercises")
  #   ex[["No.", "Topic", "Exercise", "Hint"]]
  # Data sheets: E1_A, E1_B, E2_A, E2_B, ... E10_A ... E10_D (3-5 rows each).
---

### Q1

**Q.** The RELIANCE price observations are split across E1_A and E1_B. Combine them into one DataFrame in chronological order. The final DataFrame should have a fresh 0,1,2,... index rather than retaining the original row indexes.

**A.**

```python
a, b = rd("E1_A"), rd("E1_B")

plain = pd.concat([a, b])                       # keeps the original labels
print(plain)
print("index:", list(plain.index))

fresh = pd.concat([a, b], ignore_index=True)    # the answer
print(fresh)
print("shapes:", a.shape, b.shape, "->", fresh.shape)
```

```text
         Date  Close   Volume
0  2026-01-02   1520  3200000
1  2026-01-05   1535  3500000
2  2026-01-06   1528  2900000
0  2026-01-07   1542  3100000
1  2026-01-08   1550  3800000
2  2026-01-09   1547  3000000
index: [0, 1, 2, 0, 1, 2]
         Date  Close   Volume
0  2026-01-02   1520  3200000
1  2026-01-05   1535  3500000
2  2026-01-06   1528  2900000
3  2026-01-07   1542  3100000
4  2026-01-08   1550  3800000
5  2026-01-09   1547  3000000
shapes: (3, 3) (3, 3) -> (6, 3)
```

The two blocks are already chronological, so no re-sort is needed; without `ignore_index=True` the labels read 0,1,2,0,1,2 and `.loc[0]` would return two rows.

### Q2

**Q.** E2_A contains Date, Close and Volume, while E2_B contains Date, Close and Turnover. First combine all rows while retaining every column that appears in either dataset. Then create a second result retaining only columns common to both datasets. Explain where the missing values come from in the first result.

**A.**

```python
a, b = rd("E2_A"), rd("E2_B")

out = pd.concat([a, b], ignore_index=True)              # join="outer" is the default
print(out)
print(out.isna().sum())

inn = pd.concat([a, b], join="inner", ignore_index=True)
print(inn)
print("shapes:", out.shape, inn.shape, "| common cols:", a.columns.intersection(b.columns).tolist())
```

```text
         Date  Close     Volume      Turnover
0  2026-02-02   1540  3000000.0           NaN
1  2026-02-03   1552  3300000.0           NaN
2  2026-02-04   1548  3100000.0           NaN
3  2026-02-05   1560        NaN  4.680000e+09
4  2026-02-06   1571        NaN  5.027200e+09
5  2026-02-09   1565        NaN  4.773250e+09
Date        0
Close       0
Volume      3
Turnover    3
dtype: int64
         Date  Close
0  2026-02-02   1540
1  2026-02-03   1552
2  2026-02-04   1548
3  2026-02-05   1560
4  2026-02-06   1571
5  2026-02-09   1565
shapes: (6, 4) (6, 2) | common cols: ['Date', 'Close']
```

The NaNs are not missing data — they are structural. `join="outer"` keeps the union of the column names, so the three E2_A rows have no `Turnover` value to supply and the three E2_B rows have no `Volume`, giving exactly 3 NaNs in each of those two columns. `join="inner"` keeps only `Date` and `Close`, the two columns both sheets have, so there are no gaps to fill — but `Volume` and `Turnover` are dropped without any warning. Note that on `axis=0` the `join=` argument never changes the row count (6 either way), only the column count (4 vs 2), and that the NaNs force `Volume` from `int64` to `float64`.

### Q3

**Q.** E3_A contains RELIANCE closing prices and E3_B contains NIFTY closing values for partly different dates. Set Date as the index in both DataFrames. Place the two series side-by-side once using all dates and once using only dates present in both datasets. Explain why some rows contain NaN.

**A.**

```python
a, b = rd("E3_A").set_index("Date"), rd("E3_B").set_index("Date")

out = pd.concat([a, b], axis=1)                    # all dates
print(out)

inn = pd.concat([a, b], axis=1, join="inner")      # common dates only
print(inn)
print("shapes:", out.shape, inn.shape)
print("dates only in A:", a.index.difference(b.index).tolist())
print("dates only in B:", b.index.difference(a.index).tolist())
```

```text
            RELIANCE_Close  NIFTY_Close
Date
2026-03-02          1568.0      22840.0
2026-03-03          1575.0      22910.0
2026-03-04          1562.0          NaN
2026-03-05          1580.0      23020.0
2026-03-06             NaN      22975.0
            RELIANCE_Close  NIFTY_Close
Date
2026-03-02            1568        22840
2026-03-03            1575        22910
2026-03-05            1580        23020
shapes: (5, 2) (3, 2)
dates only in A: ['2026-03-04']
dates only in B: ['2026-03-06']
```

`concat(axis=1)` aligns rows by **index label**, not by physical position, so the result's index is the union of the two date sets — five labels. 2026-03-04 exists only in the RELIANCE sheet and 2026-03-06 only in the NIFTY sheet, so each contributes one NaN; `join="inner"` keeps the three-date intersection and is NaN-free. The `set_index("Date")` is what makes this correct: without it, `concat(axis=1)` glues the frames by row number, silently pairing RELIANCE on 04 March with NIFTY on 05 March and producing two columns both called `Date`.

### Q4

**Q.** E4_A contains transactions and E4_B contains client details. Create a result containing only transactions for which Client_ID exists in both datasets. Include the client Segment in the result. Identify which transaction disappears and why.

**A.**

```python
tx, cl = rd("E4_A"), rd("E4_B")

inner = pd.merge(tx, cl[["Client_ID", "Segment"]], on="Client_ID", how="inner")
print(inner)
print("shapes:", tx.shape, cl.shape, "->", inner.shape)

chk = pd.merge(tx, cl, on="Client_ID", how="outer", indicator=True)
print(chk[["Transaction_ID", "Client_ID", "_merge"]])
```

```text
  Transaction_ID Client_ID  Amount Segment
0           T001      C101  125000  Retail
1           T002      C102   80000     HNI
2           T004      C103   95000  Retail
shapes: (4, 3) (4, 3) -> (3, 4)
  Transaction_ID Client_ID      _merge
0           T001      C101        both
1           T002      C102        both
2           T004      C103        both
3            NaN      C104  right_only
4           T003      C105   left_only
```

`T003` disappears. Its `Client_ID` is `C105`, and the client table only lists `C101`–`C104`, so an inner join — which keeps only keys present on both sides — has nothing to pair it with. The mirror-image case is client `C104`, who exists in the master but has no transaction and is therefore also absent from the inner result. Selecting `cl[["Client_ID", "Segment"]]` rather than all of `cl` keeps `Client_Name` out of the answer, which is what "include the client Segment" asks for.

### Q5

**Q.** E5_A contains loan applications and E5_B contains customer risk grades. Add RiskGrade to every loan application without dropping any application. Then identify which rows had no matching risk record.

**A.**

```python
ap, rg = rd("E5_A"), rd("E5_B")

left = pd.merge(ap, rg, on="Customer_ID", how="left", indicator=True)
print(left)
print("shape:", left.shape, "| missing RiskGrade:", left["RiskGrade"].isna().sum())
print(left.loc[left["_merge"] == "left_only"])
print("risk records never used:", sorted(set(rg["Customer_ID"]) - set(ap["Customer_ID"])))
```

```text
  App_ID Customer_ID  LoanAmount RiskGrade     _merge
0   A001        CU01      500000         A       both
1   A002        CU02      750000         B       both
2   A003        CU03      300000         A       both
3   A004        CU05      900000       NaN  left_only
4   A005        CU06      450000         B       both
shape: (5, 5) | missing RiskGrade: 1
  App_ID Customer_ID  LoanAmount RiskGrade     _merge
3   A004        CU05      900000       NaN  left_only
risk records never used: ['CU04']
```

`how="left"` makes the applications table control which rows survive, so all 5 applications are still there. Application `A004` (customer `CU05`) has no risk record and so carries a NaN `RiskGrade` and the `_merge` value `left_only`. In a left merge `right_only` is always zero, so the unused risk record `CU04` has to be found with a set difference (or by re-running the merge as `how="outer"`).

### Q6

**Q.** E6_A uses Ticker while E6_B uses Symbol. Combine them so that every security appearing in either table is retained. Add Company and Sector wherever a match exists. Identify securities found only in holdings and only in the master table.

**A.**

```python
h, m = rd("E6_A"), rd("E6_B")

out = pd.merge(h, m, left_on="Ticker", right_on="Symbol", how="outer", indicator=True)
print(out)
print("only in holdings:", out.loc[out["_merge"] == "left_only", "Ticker"].tolist())
print("only in master:  ", out.loc[out["_merge"] == "right_only", "Symbol"].tolist())
```

```text
        Ticker    Qty  AvgCost       Symbol                    Company   Sector      _merge
0          NaN    NaN      NaN  HDFCBANK.NS                  HDFC Bank  Banking  right_only
1      INFY.NS  120.0   1680.0      INFY.NS                    Infosys       IT        both
2  RELIANCE.NS  100.0   1510.0          NaN                        NaN      NaN   left_only
3       TCS.NS   80.0   4020.0       TCS.NS  Tata Consultancy Services       IT        both
only in holdings: ['RELIANCE.NS']
only in master:   ['HDFCBANK.NS']
```

The key columns are named differently but hold the same values, so `left_on="Ticker"` / `right_on="Symbol"` is what matches them; `how="outer"` keeps the union of both key sets, which is why the frame has 4 rows from two 3-row inputs. `RELIANCE.NS` is held but missing from the master, so its `Company` and `Sector` are NaN; `HDFCBANK.NS` is described in the master but not held, so its `Qty` and `AvgCost` are NaN. Two side effects worth naming: the result keeps **two** redundant key columns (each NaN where that side had no row), and an outer merge returns rows sorted by key, which is why `HDFCBANK.NS` comes first. Renaming `Symbol` to `Ticker` first and merging `on="Ticker"` gives the same rows with one clean key column.

### Q7

**Q.** Before running any code, predict how many rows will result when E7_A and E7_B are merged on Investor_ID using an inner join. Then perform the merge and explain why Investor I01 produces multiple combinations.

**A.**

**Prediction first.** Count the rows per key on each side and sum the products: `I01` has 2 trades x 2 checks = 4, `I02` has 1 x 1 = 1, so **5 rows**.

```python
t, c = rd("E7_A"), rd("E7_B")

lc = t["Investor_ID"].value_counts().sort_index()
rc = c["Investor_ID"].value_counts().sort_index()
pred = pd.DataFrame({"left_rows": lc, "right_rows": rc})
pred["product"] = pred["left_rows"] * pred["right_rows"]
print(pred)
print("PREDICTED total rows =", int(pred["product"].sum()))
```

```text
             left_rows  right_rows  product
Investor_ID
I01                  2           2        4
I02                  1           1        1
PREDICTED total rows = 5
```

```python
mm = pd.merge(t, c, on="Investor_ID", how="inner")
print(mm)
print("ACTUAL shape", mm.shape)
```

```text
  Trade_ID Investor_ID  Security Check_ID Check_Type
0     TR01         I01  RELIANCE     CK01        KYC
1     TR01         I01  RELIANCE     CK02        AML
2     TR02         I01       TCS     CK01        KYC
3     TR02         I01       TCS     CK02        AML
4     TR03         I02      INFY     CK03        KYC
ACTUAL shape (5, 5)
```

**Predicted 5, actual 5** — from 3-row and 3-row inputs. `I01` repeats on *both* sides (trades TR01/TR02, checks KYC/AML), so the merge forms every left-right pair for that key: 2 x 2 = 4 rows. That is a Cartesian product within the key, not a lookup, and nothing warns you about it. Add `validate="many_to_one"` whenever you attach a master table and the explosion becomes a loud `MergeError` instead of a silent row count you did not expect.

### Q8

**Q.** E8_A contains stock returns and E8_B contains the risk-free rate. Set Date as the index in both. Join the risk-free rate to the stock returns using the default join, then repeat using inner and outer joins. Compare the dates retained in each result.

**A.**

```python
r, f = rd("E8_A").set_index("Date"), rd("E8_B").set_index("Date")

print("default == left?", r.join(f).equals(r.join(f, how="left")))
for how in ["left", "inner", "outer"]:
    j = r.join(f, how=how)
    print(f"--- how='{how}'  shape={j.shape}")
    print(j)
```

```text
default == left? True
--- how='left'  shape=(4, 2)
            Stock_Return  Risk_Free_Rate
Date
2026-04-01         0.012             NaN
2026-04-02        -0.006         0.00022
2026-04-03         0.009         0.00022
2026-04-06         0.004         0.00023
--- how='inner'  shape=(3, 2)
            Stock_Return  Risk_Free_Rate
Date
2026-04-02        -0.006         0.00022
2026-04-03         0.009         0.00022
2026-04-06         0.004         0.00023
--- how='outer'  shape=(5, 2)
            Stock_Return  Risk_Free_Rate
Date
2026-04-01         0.012             NaN
2026-04-02        -0.006         0.00022
2026-04-03         0.009         0.00022
2026-04-06         0.004         0.00023
2026-04-07           NaN         0.00023
```

| `how` | Dates kept | Rows |
| --- | --- | --- |
| `left` (the default) | the 4 stock-return dates | 4 |
| `inner` | the 3 overlapping dates | 3 |
| `outer` | all 5 distinct dates | 5 |

`DataFrame.join()` defaults to `how="left"`, **not** inner — that is the opposite of `pd.merge()`, so write `how=` explicitly. The default keeps 2026-04-01 with a NaN rate; `inner` drops it; `outer` also brings in 2026-04-07, which has a rate but no return. For an excess-return calculation use `inner`, because a row holding only one of the two inputs produces a NaN that propagates into every derived column.

### Q9

**Q.** E9_A and E9_B both contain columns named Close and Volume and are indexed by Date. Try joining them directly. Observe the problem. Then join them successfully so the final column names clearly identify RELIANCE and TCS. Finally, explain how this differs from concat(axis=1), which can permit duplicate column names.

**A.**

```python
rel, tcs = rd("E9_A").set_index("Date"), rd("E9_B").set_index("Date")
try:
    rel.join(tcs)
except Exception as e:
    print(type(e).__name__, ":", e)
```

```text
ValueError : columns overlap but no suffix specified: Index(['Close', 'Volume'], dtype='object')
```

```python
j = rel.join(tcs, lsuffix="_RELIANCE", rsuffix="_TCS")
print(j)
print(j.columns.tolist())
```

```text
            Close_RELIANCE  Volume_RELIANCE  Close_TCS  Volume_TCS
Date
2026-05-04            1602          3400000       4085     1250000
2026-05-05            1610          3650000       4102     1180000
2026-05-06            1598          3900000       4076     1320000
['Close_RELIANCE', 'Volume_RELIANCE', 'Close_TCS', 'Volume_TCS']
```

```python
c = pd.concat([rel, tcs], axis=1)
print(c)
print("columns:", c.columns.tolist(), "| duplicated?", c.columns.duplicated().any())
print(c["Close"])
```

```text
            Close   Volume  Close   Volume
Date
2026-05-04   1602  3400000   4085  1250000
2026-05-05   1610  3650000   4102  1180000
2026-05-06   1598  3900000   4076  1320000
columns: ['Close', 'Volume', 'Close', 'Volume'] | duplicated? True
            Close  Close
Date
2026-05-04   1602   4085
2026-05-05   1610   4102
2026-05-06   1598   4076
```

`join` refuses to create ambiguous column names: overlapping non-key names raise `ValueError` until you supply `lsuffix` and/or `rsuffix`. `concat(axis=1)` has no such protection — it produces the same six values under four column labels, two of them called `Close`, with no error at all. The cost is that `c["Close"]` now returns a two-column **DataFrame** instead of a Series, so `c["Close"].mean()` gives two numbers and the frame cannot be written to a usable spreadsheet. `pd.merge` sits in between: it auto-suffixes to `_x` / `_y` and never errors, which is convenient but produces names no examiner wants to see. `rel.add_prefix("RELIANCE_").join(tcs.add_prefix("TCS_"))` and `pd.concat([rel, tcs], axis=1, keys=["RELIANCE", "TCS"])` are the two clean alternatives.

### Q10

**Q.** Build one portfolio-analysis table from E10_A to E10_D. First combine the January and February transaction logs. Next enrich each transaction with Company and Sector from the company master. Finally attach the sector risk information. Keep all transactions even if a later lookup is missing.

**A.**

One stage at a time, `how="left"` throughout so the transaction count never changes.

```python
jan, feb, mst, sec = rd("E10_A"), rd("E10_B"), rd("E10_C"), rd("E10_D")

s1 = pd.concat([jan, feb], ignore_index=True)                                   # rows
print(s1)
print("stage 1:", s1.shape)

s2 = (pd.merge(s1, mst, left_on="Ticker", right_on="Symbol", how="left")        # key column
        .drop(columns="Symbol"))
print("stage 2:", s2.shape)

final = s2.join(sec.set_index("Sector"), on="Sector", how="left")               # index lookup
print(final)
print("stage 3:", final.shape)
print(final.isna().sum())
```

```text
  Month Trade_ID       Ticker  Amount
0   Jan     J001  RELIANCE.NS  150000
1   Jan     J002       TCS.NS  120000
2   Jan     J003      INFY.NS   90000
3   Feb     F001  HDFCBANK.NS  110000
4   Feb     F002       TCS.NS   70000
5   Feb     F003   UNKNOWN.NS   50000
stage 1: (6, 4)
stage 2: (6, 6)
  Month Trade_ID       Ticker  Amount                    Company   Sector Risk_Level  Max_Portfolio_Weight
0   Jan     J001  RELIANCE.NS  150000        Reliance Industries   Energy     Medium                  0.30
1   Jan     J002       TCS.NS  120000  Tata Consultancy Services       IT     Medium                  0.35
2   Jan     J003      INFY.NS   90000                    Infosys       IT     Medium                  0.35
3   Feb     F001  HDFCBANK.NS  110000                  HDFC Bank  Banking       High                  0.25
4   Feb     F002       TCS.NS   70000  Tata Consultancy Services       IT     Medium                  0.35
5   Feb     F003   UNKNOWN.NS   50000                        NaN      NaN        NaN                   NaN
stage 3: (6, 8)
Month                   0
Trade_ID                0
Ticker                  0
Amount                  0
Company                 1
Sector                  1
Risk_Level              1
Max_Portfolio_Weight    1
dtype: int64
```

Six transactions in, six out at every stage. `F003 / UNKNOWN.NS` has no company record, and because its `Sector` is therefore NaN the stage-3 lookup fails too — the NaN propagates down the chain. One stray `how="inner"` anywhere in the pipeline would have deleted exactly that row.

# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e5]:
    - heading "Welcome to Fairmark" [level=1] [ref=e6]
    - paragraph [ref=e7]: Track contributions and ensure fairness in group projects
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: What's your first name?
        - textbox "What's your first name?" [active] [ref=e11]:
          - /placeholder: Enter your first name
      - button "Continue" [ref=e12] [cursor=pointer]
    - generic [ref=e13]:
      - paragraph [ref=e14]: Or explore with demo data
      - button "🚀 Load Demo (3 Projects, 4 Users)" [ref=e15] [cursor=pointer]
      - button "📥 Load Data From Canvas (Mock)" [ref=e16] [cursor=pointer]
      - paragraph [ref=e17]: Canvas demo shows SaaS Platform MVP with unbalanced workload (Alice 57%)
```
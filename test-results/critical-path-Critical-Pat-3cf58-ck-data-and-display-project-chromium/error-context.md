# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Hi Alice!" [level=1] [ref=e6]
      - paragraph [ref=e7]: Manage your group projects
    - generic [ref=e8]:
      - link "Create New Group" [ref=e9] [cursor=pointer]:
        - /url: /groups/new
      - link "Join Existing Group" [ref=e10] [cursor=pointer]:
        - /url: /groups/join
    - generic [ref=e11]:
      - heading "Your Groups" [level=2] [ref=e12]
      - link "SaaS Platform MVP Mock project loaded from Canvas LMS demonstrating fairness issues 4 members 18% complete" [ref=e14] [cursor=pointer]:
        - /url: /group/canvas-mock-1
        - generic [ref=e15]:
          - heading "SaaS Platform MVP" [level=3] [ref=e16]
          - paragraph [ref=e17]: Mock project loaded from Canvas LMS demonstrating fairness issues
          - generic [ref=e18]:
            - generic [ref=e19]: 4 members
            - generic [ref=e20]: 18% complete
```
# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - link "← Back to groups" [ref=e6] [cursor=pointer]:
      - /url: /groups
    - generic [ref=e7]:
      - heading "Create New Group" [level=1] [ref=e8]
      - generic [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]: Group / Project Name *
          - textbox "Group / Project Name *" [active] [ref=e12]:
            - /placeholder: e.g., Software Engineering Project
            - text: Simple Test Group
        - generic [ref=e13]:
          - generic [ref=e14]: Description (Optional)
          - textbox "Description (Optional)" [ref=e15]:
            - /placeholder: Brief description of the project...
        - generic [ref=e16]:
          - button "Create Group" [ref=e17] [cursor=pointer]
          - link "Cancel" [ref=e18] [cursor=pointer]:
            - /url: /groups
      - paragraph [ref=e19]: You will be automatically added as the first member of this group.
```
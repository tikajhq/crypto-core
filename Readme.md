
# TODO:
- Use Queuing for processing each task 
    - `Currency` class will consume from a global queue - named as currency `notation`
    - All tasks/methods call will be processed by Currency Queue. These are external requests. Ex: {`transfer`,`params`} etc.
    - Each *request* will be assigned a request ID, responses can be generated using them.
     
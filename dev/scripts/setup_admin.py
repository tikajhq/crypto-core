from pyrabbit2.api import Client

def print_box(message):
    print('='*20)
    print(message)
    print('='*20)

cl = Client('mq.c1.tik.co', 'themadhurendra', 's3cur3r@b')

# cl.is_alive()
vhost ="crypto"


print_box("Create vhost...")
print(cl.create_vhost(vhost))
print_box("List vhosts...")
print([i['name'] for i in cl.get_all_vhosts()])
# print(cl.get_vhost_names())

print_box("Create users ...")
for user in [
    {"username":"crypto.c0","password":"zmarTHERy3gmtJyZ"},
    {"username":"crypto.c1","password":"dDehDfVctnKXgG7B"},
    {"username":"crypto.c2","password":"nWkN39AgCtm5VTcF"},
    {"username":"crypto.c3","password":"xcN3Av2JJHRUKRXx"},
    {"username":"crypto.c4","password":"4dgQBWUXbPdQgjVM"}
]:

    username = user['username']
    print("Creating "+username)
    print(cl.create_user(username=username,password=user['password']))
    print("Setting permission for "+username)
    print(cl.set_vhost_permissions(vhost, username,'.*', '.*', '.*'))


print_box("Creating exchange ...")
print(cl.create_exchange(vhost, 'core_tx', 'headers'))
print(cl.get_exchange(vhost, 'core_tx'))

print_box("Creating queue...")
print(cl.create_queue(vhost,'core_tx.all'))

print_box("Creating binding...")
print(cl.create_binding(vhost, 'core_tx', 'core_tx.all', "",
                        {},# {"mail.queue":"mail.dmarc"}
                        ))

# print(cl.publish(vhost, 'example_exchange', 'my.rtkey', 'example message payload'))
# print(cl.get_messages(vhost, 'core_tx.all'))
# cl.delete_vhost(vhost)
# print([i['name'] for i in cl.get_all_vhosts()])
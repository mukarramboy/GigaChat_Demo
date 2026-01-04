from multiprocessing import Process

def cpu():
    s = 0
    for i in range(10**9):
        s += i
        
    print("s=",s)

p1 = Process(target=cpu)
p2 = Process(target=cpu)

p1.start()
p2.start()

p1.join()
p2.join()

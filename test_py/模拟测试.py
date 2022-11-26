from termcolor import colored
import time
import os

class test():
    def print_test(self):
        os.system('color')
        time.sleep(1)
        self.start_time = time.perf_counter()
        print(colored("▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮", "green"), self.start_time)
        with open("time.txt", "w+") as file:
            file.write(str(self.start_time))

if __name__ == "__main__":
    test = test()
    test.print_test()
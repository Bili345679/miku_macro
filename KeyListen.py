from logging import exception
from operator import le
from os import remove
from time import time
from pynput.keyboard import Key
from pynput import keyboard
import time


class KeyListen:
    def __init__(self, main_thread):
        self.main_thread = main_thread

        self.listener = keyboard.Listener(
            on_press=self.on_press,
            on_release=self.on_release)

        self.listener.start()

    def on_press(self, key):
        key_time = time.perf_counter()

        # 切换录制状态
        if key == Key.f9:
            self.main_thread.do_record()

        # 切换回访状态
        if key == Key.f10:
            self.main_thread.do_playback()

        # f11 强制退出
        if key == Key.f11:
            self.main_thread.exit_all()
            return False

        self.to_main_thread(key, True, key_time)

    def on_release(self, key):
        key_time = time.perf_counter()
        self.to_main_thread(key, False, key_time)

    def to_main_thread(self, key, press, key_time):
        if key == Key.backspace:
            return self.main_thread.keyboard_event("BACKSPACE", press, key_time)

        if key == Key.enter:
            return self.main_thread.keyboard_event("ENTER", press, key_time)

        try:
            char = format(key.char)
        except Exception:
            return True

        if char in self.main_thread.play_key_list or char.isdigit():
            self.main_thread.keyboard_event(char, press, key_time)

    def stop_listen(self):
        self.listener.stop()
import cpuinfo
import platform


class DeviceService:

    def get_host(self):
        return platform.node()

    def get_os(self):
        system = platform.system()

        if "linux" in system.lower():
            import distro
            info = distro.linux_distribution()
            return info[0] + " " + info[1]
        else:
            return system + " " + platform.release()

    def get_cpu(self):
        remove = ["(R)", "(TM)"]
        name = cpuinfo.get_cpu_info()['brand_raw']

        for rem in remove:
            name = name.replace(rem, "")

        return name
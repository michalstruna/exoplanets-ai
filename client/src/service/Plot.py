import matplotlib
import matplotlib.pyplot as plt
import io

matplotlib.use("Agg")


class PlotService:

    DEFAULT_SIZE = (8, 4.5)
    LC_SIZE = (9, 3)
    MINI = (8, 1)


    def scatter(self, x, y, alpha=0.5, size=10, ratio=DEFAULT_SIZE):

    def plot_lc(self, time, flux, alpha=0.5, size=10):
        buf = io.BytesIO()

        plt.figure(figsize=(9, 3))
        plt.scatter(time, flux, c="#EEE", s=size, alpha=alpha)
        plt.margins(0, 0)
        plt.gca().set_axis_off()
        plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
        plt.savefig(buf, transparent=True)
        plt.show()

        buf.seek(0)

        return buf.getvalue()

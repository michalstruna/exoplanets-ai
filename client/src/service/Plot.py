import matplotlib
import matplotlib.pyplot as plt
import io

matplotlib.use("Agg")


class PlotService:

    def plot_lc(self, time, flux):
        buf = io.BytesIO()

        plt.figure(figsize=(9, 3))
        plt.scatter(time, flux, c="#EEE", s=10, alpha=0.5)
        plt.margins(0, 0)
        plt.gca().set_axis_off()
        plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
        plt.savefig(buf, transparent=True)
        plt.show()

        buf.seek(0)

        return buf.getvalue()

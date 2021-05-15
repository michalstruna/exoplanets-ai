import matplotlib
import matplotlib.pyplot as plt
import io

matplotlib.use("Agg")


class PlotService:

    MAIN_SCATTER = (8, 4.5)

    def main_scatter(self, semaxes, masses, alpha=0.5, size=10, figsize=MAIN_SCATTER):
        buf = io.BytesIO()

        plt.figure(figsize=figsize)
        plt.xscale("log")
        plt.yscale("log")
        plt.axis([10e-2, 10e5, 10e-1, 10e6])
        plt.scatter(semaxes, masses, c="#EEE", s=size, alpha=alpha)
        plt.margins(0, 0)
        plt.gca().set_axis_off()
        plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
        plt.savefig(buf, transparent=True)
        plt.show() 

        buf.seek(0)

        return buf.getvalue()

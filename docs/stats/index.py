#!/usr/bin/python3

import pandas as pd
import numpy as np
from plotnine import *
import math

def get_name_by_interval(value, edges, names):
    for i, edge in enumerate(edges):
        if value < edge:
            return names[i]

    return names[-1]

data = pd.read_csv("planets.csv")
data["pl_shortdiscmethod"] = data["pl_discmethod"].map(lambda meth: " ".join(meth.split()[:2]))

qu = [data["st_dist"].quantile(0.25), data["st_dist"].quantile(0.5), data["st_dist"].quantile(0.75)]
data["st_disttype"] = data["st_dist"].map(lambda dist: get_name_by_interval(dist, qu, ["Q0-Q1", "Q1-Q2", "Q2-Q3", "Q3-Q4"]))

#bar(data.groupby("pl_discmethod").size())

#scatter(data, "pl_orbper", "pl_bmasse", "pl_discmeth")

def format_plot(plot, axis_x_angle = 0):
    return plot +\
        theme_light() +\
        theme(
            axis_text = element_text(size = 9),
            axis_text_x = element_text(rotation = axis_x_angle, ha = "right" if axis_x_angle else "center"),
            axis_title = element_text(size = 10),
            legend_key = element_rect(color = "white")
        )

def with_suffix(value, digits = 0):
    size = 0

    while abs(value) >= 1000:
        size += 1
        value = value / 1000.0

    return '{:.{}f}{}'.format(round(value, digits), digits, ['', 'k', 'M', 'G', 'T', 'P'][size])

def suffix_format(labels):
    return [with_suffix(label) for label in labels]

fig = format_plot(ggplot(data, aes(x = "pl_shortdiscmethod", fill = "st_disttype")) +\
    geom_histogram(binwidth = 1
    , alpha = 0.5) +\
    labs(x = "Metoda", y = "Počet objevených exoplanet", fill = "Vzdálenost") +\
    scale_y_continuous(labels = suffix_format), axis_x_angle = 45)

fig.save("count_by_method.pdf")


fig = format_plot(ggplot(aes(x = "pl_orbper", y = "pl_bmasse", color = "pl_shortdiscmethod"), data = data) +\
    geom_point(stroke = 2, size = 1, alpha = 0.2) +\
    labs(x = "Doba oběhu [pozemské dny]", y = "Hmotnost [hmotnost Země]", color = "Metoda") +\
    scale_x_log10(labels = suffix_format) +\
    scale_y_log10(labels = suffix_format) +\
    scale_color_manual(values = ["orange", "blue", "gray", "chartreuse", "gold", "cyan", "deeppink", "black", "red", "darkgreen", "purple"]))

fig.save("period_by_mass_by_method.pdf")



########## SUNLIGHT SPECTRUM ##########

spectrum = pd.melt(pd.read_csv("sunlight_spectrum.csv"), id_vars = ["wavelength"], value_vars = ["intensity", "intensity2"])

fig = format_plot(ggplot(spectrum, aes(x = "wavelength")) +\
    geom_line(aes(y = "value", group = "variable", color = "variable")) +\
    xlim(280, 2000) +\
    labs(x = "Vlnová délka [nm]", y = "Intenzita [W / (m^2 * nm)]") +\
    scale_color_manual(values = ["red", "blue"], name = "Oblast", labels = ["Ve vesmíru", "Na zemi"])) +\
    theme(plot_background = element_rect(alpha = 0), panel_background = element_rect(alpha = 0), legend_background = element_rect(alpha = 0))

#fig.save("sunlight_spectrum.png", format = "png") # Uncomment for save plot without color spectrum.

########## 51 PEGASI RADIAL VELOCITY ##########

velocity_period = 4.2311 * 2 # Show 2 periods (1 period = 4.2311 days).
velocity = pd.read_csv("51_pegasi_radial_velocity.csv")
velocity["date"] = velocity["date"] % velocity_period
velocity.loc[:, "data"] = "1" # TODO: Refactor.
velocity.loc[:, "calc"] = "0"

fig = format_plot(ggplot( velocity, aes(x = "date", y = "velocity")) +\
    stat_smooth(aes(color = "calc"), method = "gpr") +\
    geom_point(aes(color = "data")) +\
    geom_errorbar(aes(ymax = "velocity+error", ymin = "velocity-error", color = "data"), width = 0.2) +\
    labs(x = "Den", y = "Radiální rychlost [m/s]") +\
    scale_color_manual(name = "Data", values = ["red", "blue"], labels = ["Dopočítáno", "Naměřeno"]) +\
    scale_x_continuous(breaks = range(0, math.ceil(velocity_period))) +\
    scale_y_continuous(breaks = range(-80, 90, 20))) # TODO: Legend item backgound transparent.

fig.save("51_pegasi_radial_velocity.pdf")

########## SINUS ##########
x = np.linspace(0, 12, 100)
y1 = 2 * np.sin(x)
y2 = np.sin(5 * x)
sinus = pd.DataFrame({ "x": x, "y1": y1, "y2": y2, "y3": y1 + y2, "y1c": "1", "y2c": "2", "y3c": "3" }) # TODO: Refactor.

fig = format_plot(ggplot(sinus, aes(x = "x")) +\
    geom_line(aes(y = "y1", color = "y1c")) +\
    geom_line(aes(y = "y2", color = "y2c")) +\
    geom_line(aes(y = "y3", color = "y3c"), size = 2) +\
    labs(x = "x", y = "y") +\
    scale_color_manual(name = "Funkce", values = ["blue", "green", "red"], labels = ["y1 = 2sin(x)", "y2 = sin(5x)", "y3 = y1 + y2"]) +\
    scale_x_continuous(breaks = range(0, 12)) +\
    scale_y_continuous(breaks = range(-3, 3)))

fig.save("sinus.pdf")